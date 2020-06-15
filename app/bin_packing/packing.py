import os
import sys
import time
import pathlib
import json
import shutil
import random
import math
from random import shuffle
from copy import deepcopy

from bin_packing.rectpack import newPacker
from bin_packing.rectpack.maxrects import MaxRectsBssf
from bin_packing.rectpack.skyline import SkylineMwflWm

from bin_packing.boxes import boxes as pj_boxes, larger_boxes, custom_box
from bin_packing.index import productToColor

#order 99 --- 24x16 placed in box 3 instead of box 2
#         --- after getting result, get all box 4 (where all items fit into box 3) and box 3 and try fitting into boxes 3 

def packing_algo(order):
    #filter products that arent supposed be here (posters etc)
    id_to_product = {product['id']: product for product in order['products']}
    
    if order['optimize']:
        order['boxes'] = deepcopy(pj_boxes)

    sorted_boxes = parse_boxes(order['boxes'])
    #print(sorted_boxes)

    func_map = { 0: parse_default, 1: parse_optimized }
    print(func_map[order["optimize"]])
    parse_order = func_map[order["optimize"]]
    oversized_products, large_products, normal_products = parse_order(order, sorted_boxes)

    if(len(large_products) + len(normal_products) > 20):
        iterations = 100
    else:
        iterations = 200

    best_boxes = None
    best_count = None
    best_score = None
    for i in range(iterations):
        if(i > 0):
            shuffle(large_products)
            shuffle(normal_products)

        products = large_products + normal_products
        boxes = pack(order['id'], order['optimize'], products, sorted_boxes)
        
        '''
        boxes_count = {}
        total_boxes = 0;
        for box in boxes:
            
            name = box['box']['name']
            if name in boxes_count:
                boxes_count[name] = boxes_count[name] + 1
            else:
                boxes_count[name] = 1
            total_boxes += 1
        print(boxes_count)
        '''

        score = 0
        total_boxes = 0
        for box in boxes:
            score += box["box"]["sorted_points"]
            total_boxes += 1
     
        if not best_boxes or total_boxes < best_count or (total_boxes <= best_count and score < best_score):
            best_boxes = boxes
            best_count = total_boxes
            best_score = score

    if(order['optimize']):
       handle_oversized_products(oversized_products, best_count + 1, best_boxes)

    json_output = generate_JSON(order['id'], order['optimize'], best_boxes, id_to_product)
    return json_output

def parse_boxes(boxes):
    sorted_boxes = sorted(boxes, reverse=False, key=lambda box: box['width'] * box['height'])
    box_id = 1
    for box in sorted_boxes:
        box['sorted_points'] = box_id
        box_id += 1;
    
    return sorted_boxes

def parse_optimized(order, boxes):
    order_products = deepcopy(order['products'])
    oversized, default_products = filter_by_box_size(order_products, boxes[4])
    products_fit_box_5, products_fit_box_4 = filter_by_box_size(default_products, boxes[3])

    sorted_box_5 = sorted(products_fit_box_5, reverse=True, key=lambda item: item['width'] * item['height'])
    sorted_box_4 = sorted(products_fit_box_4, reverse=True, key=lambda item: (max(item['width'], item['height']), min(item['width'], item['height'])))

    return oversized, sorted_box_5, sorted_box_4
    
def parse_default(order, boxes):
    sorted_products = sorted(order['products'], reverse=True, key=lambda item: item['width'] * item['height'])
    products, oversized = filter_oversized_items(sorted_products, boxes)

    return oversized, [], products 

def pack(order_id, order_optimize, products, boxes):
    output = []
    start = time.time()
    bin_counter = 0;
    
    while(len(products) > 0):
        box_index = get_initial_box_size(order_optimize, products, boxes)
        bins = get_first_bins(products, boxes[box_index])

        if len(bins) < 2 or (len(bins) == 2 and (not bins[0] or not bins[1])):
            break;

        bin = get_optimal_bin(bins)
        products, removed = remove_completed_items(products, bin)

        smaller_box_index = box_index - 1
        while(smaller_box_index >= 0 and calculate_bin_area(bin) < boxes[smaller_box_index]['width'] * boxes[smaller_box_index]['height']):
            potential_bins = get_first_bins(removed, boxes[smaller_box_index])

            if len(potential_bins) < 2 or (len(potential_bins) == 2 and (not potential_bins[0] or not potential_bins[1])):
                break;

            potential_bin = get_optimal_bin(potential_bins)
            
            if len(potential_bin) == len(removed):
                bin = potential_bin
                box_index = smaller_box_index
            else:
                break;
            
            smaller_box_index -= 1       
            
        bin_counter += 1
        output.append({"box": deepcopy(boxes[box_index]), "box_number": bin_counter, "bin": bin})

    return output;

def remove_completed_items(products, bin):
    to_be_removed = [item[5] for item in bin]
    products_new, removed = [], []
    for item in products:
        if item['id'] in to_be_removed:
            removed.append(item)
        else:
            products_new.append(item)
    return products_new, removed

def get_optimal_bin(bins):
    optimal_bin, optimal_bin_area = None, 0
    for bin_index, bin in enumerate(bins):
        area = calculate_bin_area(bin)
        if(area > optimal_bin_area or (area == optimal_bin_area and len(bin) > len(optimal_bin))):
            optimal_bin_area = area
            optimal_bin = bin
    return optimal_bin

def calculate_bin_area(bin):
    area = 0
    for item in bin:
        b, x, y, w, h, rid = item
        area += w * h

    return area

def get_first_bins(products, box):
    bins = []
    algos = [MaxRectsBssf, SkylineMwflWm]
    for algo_index, algo in enumerate(algos):
        packer = newPacker(pack_algo=algo)
        for item in products:
            packer.add_rect(item['width'], item['height'], item['id'])

        packer.add_bin(box['width'], box['height'])
        packer.pack()

        bins.append(packer.rect_list())

    return bins

def get_initial_box_size(optimize, products, boxes):
    if not optimize: return len(boxes) - 1

    for product in products:
        if(product['width'] == 48 or product['height'] == 48):
            return 4

        if(product['width'] > 34 and product['height'] >= 34):
            return 4

    return 3

def filter_oversized_items(items, boxes):
    fits = []
    oversized = []
    
    for item in items:
        item_filtered = False

        for box in boxes:

            item_fits = False
            if (item['width'] <= box['width'] and item['height'] <= box['height']):
                item_fits = True
            if (item['height'] <= box['width'] and item['width'] <= box['height']):
                item_fits = True
            if item_fits:
                fits.append(item)
                item_filtered = True
                break

        if not item_filtered:
            oversized.append(item)

    return fits, oversized

def filter_by_box_size(products, box):

    #SORT_AREA  = lambda rectlist: sorted(rectlist, reverse=True, key=lambda r: r[0]*r[1])
    oversized = []
    default_size = []
    for item in products:
        item_fits = False
        if (item['width'] <= box['width'] and item['height'] <= box['height']):
            item_fits = True
        if (item['height'] <= box['width'] and item['width'] <= box['height']):
            item_fits = True
        if item_fits:
            default_size.append(item)
        else:
            oversized.append(item)

    return oversized, default_size

def handle_oversized_products(oversized_products, bin_counter, boxes):
    for item in oversized_products:
        if item['width'] < item['height']:
            item['width'], item['height'] = item['height'], item['width']
        item_tuple = (0, 0, 0, item['width'], item['height'], item['id'])
        box = get_oversized_box(item)
        if not box:
            box = deepcopy(custom_box)
            box['width'], box['height'] = item['width'], item['height']
        bin = [item_tuple]
        boxes.append({"box": box, "box_number": bin_counter, "bin": bin})
        bin_counter += 1
        
def get_oversized_box(item):

    for box_index in larger_boxes:
        box = larger_boxes[box_index]
        item_fits = False
        if (item['width'] <= box['width'] and item['height'] <= box['height']):
            item_fits = True
        if (item['height'] <= box['width'] and item['width'] <= box['height']):
            item_fits = True
        if item_fits:
            return box
    return None

def generate_JSON(order_id, order_optimize, boxes, id_to_item):
    json_file = {
        'id': order_id,
        'number_of_boxes': len(boxes)
    }

    boxes_json = []
    for index, box_data in enumerate(boxes):
        items_json = []
        for item in box_data['bin']:
            b, x, y, w, h, rid = item
            original_item = id_to_item[rid]
            if(order_optimize and original_item['product'] in productToColor):
                color = productToColor[original_item['product']]
            else:
                color = original_item['color']
            item_json = {
                "id": rid,
                "product": original_item['product'],
                "width": w,
                "height": h,
                "x": x,
                "y": y,
                "color": color,
                "url": original_item['url']
            }
            items_json.append(item_json)
            
        
        box_json = {
            'box_index': box_data['box_number'],
            'box': box_data['box'],
            'items': items_json
        }
        boxes_json.append(box_json)

    json_file['boxes'] = boxes_json
    return json_file
