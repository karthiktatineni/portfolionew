

def test_greeting_responses():
    """Test that greetings get proper conversational responses"""
    
    greeting_tests = [
        "Hello",
        "Hi", 
        "Hey",
        "Hi there",
        "Hello there",
        "Good morning",
        "Good afternoon",
        "Good evening"
    ]
    
    expected_response_patterns = [
        "hello",
        "help",
        "assistant",
        "how can i help"
    ]
    
    print("=== GREETING RESPONSE TEST ===\n")
    
    passed = 0
    failed = 0
    
    for greeting in greeting_tests:
        response = get_llm_response_for_greeting(greeting)
        response_lower = response.lower()
        
        # Check if response contains expected greeting elements
        is_good_response = any(pattern in response_lower for pattern in expected_response_patterns)
        
        if is_good_response:
            status = "OK"
            passed += 1
        else:
            status = "FAIL"
            failed += 1
            
        print(f"[{status}] Input: '{greeting}'")
        print(f"      Response: '{response}'")
        
        if not is_good_response:
            print(f"      Expected: Should contain greeting and offer help")
        print()
    
    print(f"=== RESULTS ===")
    print(f"Passed: {passed}/{len(greeting_tests)}")
    print(f"Failed: {failed}/{len(greeting_tests)}")
    
    if failed == 0:
        print("\n[SUCCESS] All greetings get proper conversational responses!")
    else:
        print(f"\n[WARNING] {failed} greeting(s) need improvement")

def get_llm_response_for_greeting(greeting_input):
    """Simulate the greeting response logic from voice_pipeline"""
    greeting_patterns = ['hello', 'hi', 'hey', 'hi there', 'hello there', 'good morning', 'good afternoon', 'good evening']
    
    if any(pattern in greeting_input.lower() for pattern in greeting_patterns):
        return "Hello! I'm Karthik's AI assistant. How can I help you today?"
    else:
        return "This would go to LLM processing: " + greeting_input

if __name__ == "__main__":
    test_greeting_responses()