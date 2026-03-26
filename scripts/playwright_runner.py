import sys
import argparse
from playwright.sync_api import sync_playwright

def main():
    parser = argparse.ArgumentParser(description="Basic Playwright Testing Runner")
    parser.add_argument("url", help="The URL to test (e.g., http://localhost:3000)")
    parser.add_argument("--screenshot", action="store_true", help="Take a screenshot of the page")
    parser.add_argument("--a11y", action="store_true", help="Run basic accessibility check (via Axe integration logic or simple visual check)")
    
    args = parser.parse_args()
    
    with sync_playwright() as p:
        print(f"Running basic automated test on: {args.url}")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        try:
            response = page.goto(args.url)
            print(f"[{response.status}] Visited {args.url}")
            
            if response.status >= 400:
                print(f"❌ Error: Page returned status code {response.status}")
                sys.exit(1)
            else:
                print("✅ Page loaded successfully!")
            
            if args.screenshot:
                screenshot_path = "test_screenshot.png"
                page.screenshot(path=screenshot_path)
                print(f"📸 Screenshot saved to {screenshot_path}")
                
            if args.a11y:
                # Mock a11y output logic for a simplified test runner 
                # (Can be extended with axe-core-playwright later)
                print("♿ Running A11y heuristic checks...")
                buttons = page.locator("button").all()
                missing_aria = [b for b in buttons if not b.get_attribute("aria-label") and not b.text_content()]
                if missing_aria:
                    print(f"⚠️ Warning: Found {len(missing_aria)} buttons missing text content or aria-label.")
                else:
                    print("✅ Basic A11y checks passed!")
                    
        except Exception as e:
            print(f"❌ Failed to reach {args.url}: {str(e)}")
            sys.exit(1)
        finally:
            browser.close()

if __name__ == "__main__":
    main()
