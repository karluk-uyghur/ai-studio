#!/usr/bin/env bash
# قارلۇق ۋىدىئو تەرجىمە - ياساش ۋە ئىجرا قىلىش بۇيرۇقى
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🚀 [Qarluq Video Translator] تەييارلىق ۋە ياساش باشلاندى..."
echo "📦 تەكشۈرۈش ئېلىپ بېرىلماقتا..."

python3 "$SCRIPT_DIR/validate.py" "شەرقىي تۈركىستان ۋە خىتاي سىياسىي ۋەزىيىتى تەھلىلى"

if [ -f "$BASE_DIR/assets/weapons_of_the_future.mp4" ]; then
  echo "🎬 weapons_of_the_future.mp4 سىن ھۆججىتى تەكشۈرۈلدى (بار)"
fi

if [ -f "$BASE_DIR/assets/weapons_of_the_future_dubbed_voice.mp3" ]; then
  echo "🔊 weapons_of_the_future_dubbed_voice.mp3 كىلون ئاۋاز دۇبليۇسى تەكشۈرۈلدى (بار)"
fi

echo "🎉 قارلۇق سىستېمىسى تولۇق تەييار!"
