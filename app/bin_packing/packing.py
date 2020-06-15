import os
import sys
import time
import pathlib
import json
import shutil
import random
from bin_packing.rectpack import newPacker

from bin_packing.boxes import boxes, larger_boxes, custom_box

from bin_packing.rectpack.maxrects import MaxRectsBssf
from bin_packing.rectpack.skyline import SkylineMwflWm


from bin_packing.index import productToColor


from copy import deepcopy



def packing_algo(order):

    # filter products that arent supposed be here (posters etc)
    id_to_item = {item['id']: item for item in order['products']}


    
    
    order_products = deepcopy(order['products'])
    oversized_products, default_products = filter_by_box_size(order_products, 5)
    products_fit_box_5, products_fit_box_4 = filter_by_box_size(default_products, 4)
    products = sort_products(products_fit_box_5, products_fit_box_4)
    if not products and not oversized_products: return

    output = []

    start = time.time()

    bin_counter = 0;
    while(len(products) > 0):
        #print('=' * 100)
        box, box_index = get_initial_box_size(products)

        bins = getFirstBins(products, box)

        if len(bins) < 2 or (len(bins) == 2 and (not bins[0] or not bins[1])):
                break;

        bin = getOptimalBin(bins)
        products, removed = remove_completed_items(products, bin)

        #products_in_this_bin = deepcopy(removed)

        smaller_box_index = box_index - 1
        while(smaller_box_index >= 1 and calculateBinArea(bin) < boxes[smaller_box_index]['area']):
            smaller_box = boxes[smaller_box_index]
            potential_bins = getFirstBins(removed, smaller_box)


            if len(potential_bins) < 2 or (len(potential_bins) == 2 and (not potential_bins[0] or not potential_bins[1])):
                break;


            potential_bin = getOptimalBin(potential_bins)
            
            if len(potential_bin) == len(removed):
                bin = potential_bin
                box = smaller_box
                box_index = smaller_box_index
            else:
                break;
            
            smaller_box_index -= 1       

            
        #print(bin)
        bin_counter += 1
        output.append({"box": deepcopy(box), "box_number": bin_counter, "bin": bin})


    handle_oversized_products(order, oversized_products, bin_counter + 1, id_to_item, output)

    
    #print("Total items: {}".format(len(order['products'])))

    json_output = generateJSON(output, id_to_item, order['id'])

    images = ["https://i.imgur.com/SeyV6fG.png",
              "https://i.imgur.com/j9HWSmS.jpeg",
              "https://i.imgur.com/QXhZt0t.jpg",
              "https://i.imgur.com/1lqBCGK.jpg",
              "https://i.imgur.com/GDAStfX.jpg",
              "https://i.imgur.com/qnpBsNw.jpg",
              "https://i.imgur.com/4PoTjBe.jpg",
              "https://i.imgur.com/ZWGeI3I.jpg",
              "https://i.imgur.com/xqWnFok.jpg",
              "https://i.imgur.com/KfQ1qsK.png",
              "https://i.imgur.com/FykFLSM.jpeg",
              "https://i.imgur.com/baPqZXo.jpg"]
              
    for box in json_output['boxes']:
        for item in box['items']:
            item['url'] = random.choice(images)
            item['bcolor'] = productToColor[item['product']]


    #print(json_output)
    print("Run Time: {}".format(time.time() - start))
    return json_output


    
    

def remove_completed_items(products, bin):
    to_be_removed = [item[5] for item in bin]
    products_new, removed = [], []
    for item in products:
        if item['id'] in to_be_removed:
            removed.append(item)
        else:
            products_new.append(item)
    return products_new, removed

def getOptimalBin(bins):
    optimal_bin, optimal_bin_area = None, 0
    for bin_index, bin in enumerate(bins):
        area = calculateBinArea(bin)
        if(area > optimal_bin_area or (area == optimal_bin_area and len(bin) > len(optimal_bin))):
            optimal_bin_area = area
            optimal_bin = bin
    return optimal_bin

def calculateBinArea(bin):
    area = 0
    for item in bin:
        b, x, y, w, h, rid = item
        area += w * h

    return area

def getFirstBins(products, box):
    bins = []
    algos = [MaxRectsBssf, SkylineMwflWm]
    for algo_index, algo in enumerate(algos):
        

        packer = newPacker(pack_algo=algo)

        # Add the rectangles to packing queue
        for item in products:
            packer.add_rect(item['width'], item['height'], item['id'])

        # Add the bins where the rectangles will be placed
        packer.add_bin(box['width'], box['height'])

        # Start packing
        packer.pack()

        bins.append(packer.rect_list())

    return bins

def get_initial_box_size(products):
    #try SORT_LSIDE for longest size
    for product in products:
        if(product['width'] == 48 or product['height'] == 48):
            return boxes[5], 5

        if(product['width'] > 34 and product['height'] >= 34):
            return boxes[5], 5

    return boxes[4], 4

def clear_dir(id):
    folder = 'lib/assets/rectpack/orders'
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)

        try:
            if os.path.isdir(file_path) and filename != str(id):
                stat = os.stat(file_path)
                stime = stat.st_mtime
                if(time.time() - stime > 60):
                    shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))

def filter_by_box_size(products, box_id):

    #SORT_AREA  = lambda rectlist: sorted(rectlist, reverse=True, key=lambda r: r[0]*r[1])
    oversized = []
    default_size = []
    for item in products:
        item_fits = False
        if (item['width'] <= boxes[box_id]['width'] and item['height'] <= boxes[box_id]['height']):
            item_fits = True
        if (item['height'] <= boxes[box_id]['width'] and item['width'] <= boxes[box_id]['height']):
            item_fits = True
        if item_fits:
            default_size.append(item)
        else:
            oversized.append(item)

    return oversized, default_size


def sort_products(box_5, default_size):
    sorted_box_5 = sorted(box_5, reverse=True, key=lambda item: item['width'] * item['height'])
    sorted_default = sorted(default_size, reverse=True, key=lambda item: (max(item['width'], item['height']), min(item['width'], item['height'])))
    #key=lambda item: (max(item['width'], item['height']), min(item['width'], item['height']))

    return sorted_box_5 + sorted_default

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

def handle_oversized_products(order, oversized_products, bin_counter, id_to_item, output):
    for item in oversized_products:
        if item['width'] < item['height']:
            item['width'], item['height'] = item['height'], item['width']
        item_tuple = (0, 0, 0, item['width'], item['height'], item['id'])
        box = get_oversized_box(item)
        if not box:
            box = deepcopy(custom_box)
            box['width'], box['height'] = item['width'], item['height']
        bin = [item_tuple]
        output.append({"box": box, "box_number": bin_counter, "bin": bin})
        bin_counter += 1
        
def generateJSON(boxes, id_to_item, order_id):
    json_file = {
        'id': order_id,
        'number_of_boxes': len(boxes)
    }

    boxes_json = []
    for index, box_data in enumerate(boxes):
        items_json = []
        for item in box_data['bin']:
            b, x, y, w, h, rid = item
            item_json = {
                "id": rid,
                "product": id_to_item[rid]['product'],
                "width": w,
                "height": h,
                "x": x,
                "y": y
            }
            items_json.append(item_json)
            
        box_data['box']['id'] = index
        box_json = {
            'box_index': box_data['box_number'],
            'box': box_data['box'],
            'items': items_json
        }
        boxes_json.append(box_json)

    json_file['boxes'] = boxes_json
    return json_file
