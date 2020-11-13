from order import *
import sys

id_to_order = {
    192161: order192161,
    192162: order192162,
    192163: order192163,
    192164: order192164,
    192165: order192165,
    192166: order192166,
}

MAX_SERIAL_VALUE = 2147483647

def parseInt(s):
    try: 
        parsed = int(s)
        return parsed if 0 < parsed < MAX_SERIAL_VALUE else 0
    except ValueError:
        return 0

def date_difference(then, now):
    dt = now - then
    offset = dt.seconds + (dt.days * 60*60*24)

    delta_s = int(offset % 60)
    offset /= 60
    delta_m = int(offset % 60)
    offset /= 60
    delta_h = int(offset % 24)
    offset /= 24
    delta_d = int(offset)

    if(delta_d > 365):
        years = int(delta_d / 365)
        return "{} year{} ago".format(years, "s" if years > 1 else "")
    if(delta_d > 30):
        months = int(delta_d / 30)
        return "{} month{} ago".format(months, "s" if months > 1 else "")
    if(delta_d > 0):
        return "{} day{} ago".format(delta_d, "s" if delta_d > 1 else "")
    if delta_h > 0:
        return "{} hour{} ago".format(delta_h, "s" if delta_h > 1 else "")
    if delta_m > 0:
        return "{} minute{} ago".format(delta_m, "s" if delta_m > 1 else "")
    if delta_s > 30:
        return "{} seconds ago".format(delta_s)
    else:
        return "just now"




