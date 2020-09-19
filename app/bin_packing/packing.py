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

def packing_algo(order):
    id_to_product = {product['id']: product for product in order['products']}
    sorted_boxes = parse_boxes(order['boxes'])
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
        boxes = pack(order['id'], products, sorted_boxes)
        
        score = 0
        total_boxes = 0
        for box in boxes:
            score += box["box"]["sorted_points"]
            total_boxes += 1
     
        if not best_boxes or total_boxes < best_count or (total_boxes <= best_count and score < best_score):
            best_boxes = boxes
            best_count = total_boxes
            best_score = score

    json_output = generate_JSON(order['id'], best_boxes, id_to_product)
    return json_output

def parse_boxes(boxes):
    sorted_boxes = sorted(boxes, reverse=False, key=lambda box: box['width'] * box['height'])
    box_id = 1
    for box in sorted_boxes:
        box['sorted_points'] = box_id
        box_id += 1;
    
    return sorted_boxes
    
def parse_order(order, boxes):
    sorted_products = sorted(order['products'], reverse=True, key=lambda item: item['width'] * item['height'])
    products, oversized = filter_oversized_items(sorted_products, boxes)

    return oversized, [], products 

def pack(order_id, products, boxes):
    output = []
    start = time.time()
    bin_counter = 0;
    
    while(len(products) > 0):
        box_index = get_initial_box_size(products, boxes)
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

def get_initial_box_size(products, boxes):
    return len(boxes) - 1

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

def generate_JSON(order_id, boxes, id_to_item):
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
            print(original_item, flush=True)
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
