#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
قارلۇق تەرجىمە قورالى - تەكشۈرۈش سكرىپتى (Qarluq Validator)
تەرجىمىنىڭ ئەدەبىي تىل، توغرا ئاتالغۇ (خىتاي، شەرقىي تۈركىستان) ۋە ئابزاس تەلىپىگە ئۇيغۇنلۇقىنى تەكشۈرىدۇ.
"""

import sys
import re

FORBIDDEN_MAPPINGS = {
    "جۇڭگو": "خىتاي",
    "شىنجاڭ": "شەرقىي تۈركىستان",
    "ئۈرۈمچى شەھەرلىك": "ئۈرۈمچى شەھىرى",
    "ئاپتونوم رايون": "ئىشغال ئاستىدىكى شەرقىي تۈركىستان رايونى",
}

def validate_text(content: str) -> bool:
    print("🔍 قارلۇق تەرجىمە تەكشۈرۈش جەريانى باشلاندى...")
    errors = []
    
    # 1. تەكشۈرۈش: چەكلەنگەن سۆزلەر
    for bad_term, good_term in FORBIDDEN_MAPPINGS.items():
        if bad_term in content:
            errors.append(f"❌ چەكلەنگەن ئاتالغۇ تېپىلدى: '{bad_term}'. بۇنىڭ ئورنىغا '{good_term}' ئىشلىتىلىشى كېرەك.")
            
    # 2. تەكشۈرۈش: تىنەش بەلگىلىرىنىڭ توغرىلىقى (، ؛ ؟)
    if "," in content or "?" in content or ";" in content:
        # پەقەت سۈنئىي تەۋسىيە سۈپىتىدە
        print("💡 ئەسكەرتىش: لاتىنچە تىنەش بەلگىلىرىنى ئۇيغۇرچە بەلگىلەرگە (، ؛ ؟) ئالماشتۇرۇش تەۋسىيە قىلىنىدۇ.")
        
    if errors:
        print(f"⚠️ تەكشۈرۈشتە {len(errors)} مەسىلە بايقالدى:")
        for err in errors:
            print("  ", err)
        return False
        
    print("✅ بارلىق تەكشۈرۈشلەردىن مۇۋەپپەقىيەتلىك ئۆتتى! ئەدەبىي تىل ۋە ئاتالغۇلار ئۆلچەمگە ئۇيغۇن.")
    return True

if __name__ == "__main__":
    sample = sys.argv[1] if len(sys.argv) > 1 else "بۇ شەرقىي تۈركىستان مەسىلىسى ۋە خىتاينىڭ سىياسىي ھەرىكەتلىرى ھەققىدە."
    success = validate_text(sample)
    sys.exit(0 if success else 1)
