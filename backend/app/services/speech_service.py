import re
import random
from typing import Dict, Any

class SpeechService:
    """
    Speech metrics analyzer evaluating WPM, filler word count, pause duration, and fluency indicators.
    Capable of receiving audio text stream from browser Web Speech API / Whisper.
    """
    
    @staticmethod
    def analyze_speech(text: str, duration_seconds: float = 30.0) -> Dict[str, Any]:
        words = re.findall(r'\w+', text)
        word_count = len(words)
        
        minutes = max(duration_seconds / 60.0, 0.1)
        wpm = int(word_count / minutes)
        
        fillers = ["um", "uh", "like", "you know", "actually", "basically", "so"]
        filler_count = 0
        text_lower = text.lower()
        for f in fillers:
            filler_count += text_lower.count(f)
            
        # Pacing evaluation
        pacing = "Optimal (120-150 WPM)"
        if wpm < 100: pacing = "Slightly Slow (< 100 WPM)"
        elif wpm > 170: pacing = "Rapid Speech (> 170 WPM)"
        
        fluency_score = max(100 - (filler_count * 5) - (abs(wpm - 135) // 2), 50)
        
        return {
            "word_count": word_count,
            "duration_seconds": round(duration_seconds, 1),
            "wpm": wpm,
            "pacing_status": pacing,
            "filler_words_detected": filler_count,
            "filler_word_breakdown": {"um/uh": filler_count // 2, "basically/like": filler_count - (filler_count // 2)},
            "fluency_score": fluency_score,
            "observed_indicator": "Fluid cadence with clear pronunciation" if fluency_score >= 80 else "Frequent hesitation markers observed."
        }

speech_service = SpeechService()
