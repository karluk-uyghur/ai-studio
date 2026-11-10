#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
قارلۇق ۋىدىئو ئانالىز ۋە YouTube ئۇچۇر تارتىش سكرىپتى (Qarluq YouTube Ingester)
YouTube ياكى ھەرقانداق تور سىن ئادرېسىدىن ئۇچۇر تارتىپ، قارلۇق ئۆلچەملىرىگە تەييارلايدۇ.
"""

import sys
import json
import re
import urllib.request

def extract_youtube_id(url: str) -> str:
    match = re.search(r'(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})', url)
    return match.group(1) if match else ""

def fetch_video_metadata(url: str):
    yt_id = extract_youtube_id(url)
    print(f"🎯 قارلۇق ۋىدىئو ئادرېسى بىر تەرەپ قىلىنماقتا: {url}")
    if yt_id:
        print(f"✅ بايقالغان YouTube ID: {yt_id}")
        oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={yt_id}&format=json"
        req = urllib.request.Request(oembed_url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode())
                print(f"🎬 ۋىدىئو نامى: {data.get('title')}")
                print(f"👤 ئاپتور: {data.get('author_name')}")
                print(f"🖼 رەسىم: {data.get('thumbnail_url')}")
                return data
        except Exception as e:
            print("⚠️ oEmbed ئالاقە كاشىلىسى:", e)
    return {"title": "نامەلۇم سىن", "url": url}

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "https://youtu.be/bYrwEQ_Fr_I?si=kS0ZVj3gnJG6zGcl"
    res = fetch_video_metadata(target)
    print("✨ سىن ئۇچۇرلىرى تارتىلدى. قارلۇق ئەدەبىي تەرجىمە ۋە سىياسىي-ھەربىي تەھلىلگە تەييار!")
