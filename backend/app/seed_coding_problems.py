import json

def get_coding_problems_seed():
    """Generates 50+ curated industry-standard interview coding problems with full metadata, sample cases, and starter templates."""
    problems = [
        # Arrays & Hashing (10)
        {
            "title": "Two Sum",
            "slug": "two-sum",
            "category": "Arrays & Hashing",
            "difficulty": "Easy",
            "problem_statement": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input would have exactly one solution.",
            "input_format": "nums = [2,7,11,15], target = 9",
            "output_format": "[0, 1]",
            "constraints": "2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9",
            "sample_cases": [{"input": "nums = [2,7,11,15], target = 9", "expected": "[0, 1]"}],
            "hidden_cases": [{"input": "nums = [3,2,4], target = 6", "expected": "[1, 2]"}],
            "templates": {
                "python": "def twoSum(nums, target):\n    # Write O(n) hash map solution\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i\n    return []\n",
                "javascript": "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}"
            }
        },
        {
            "title": "Best Time to Buy and Sell Stock",
            "slug": "best-time-to-buy-and-sell-stock",
            "category": "Arrays & Hashing",
            "difficulty": "Easy",
            "problem_statement": "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
            "input_format": "prices = [7,1,5,3,6,4]",
            "output_format": "5",
            "constraints": "1 <= prices.length <= 10^5, 0 <= prices[i] <= 10^4",
            "sample_cases": [{"input": "prices = [7,1,5,3,6,4]", "expected": "5"}],
            "hidden_cases": [{"input": "prices = [7,6,4,3,1]", "expected": "0"}],
            "templates": {
                "python": "def maxProfit(prices):\n    min_price = float('inf')\n    max_p = 0\n    for p in prices:\n        min_price = min(min_price, p)\n        max_p = max(max_p, p - min_price)\n    return max_p\n"
            }
        },
        {
            "title": "Contains Duplicate",
            "slug": "contains-duplicate",
            "category": "Arrays & Hashing",
            "difficulty": "Easy",
            "problem_statement": "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
            "input_format": "nums = [1,2,3,1]",
            "output_format": "true",
            "constraints": "1 <= nums.length <= 10^5",
            "sample_cases": [{"input": "nums = [1,2,3,1]", "expected": "true"}],
            "hidden_cases": [{"input": "nums = [1,2,3,4]", "expected": "false"}],
            "templates": {
                "python": "def containsDuplicate(nums):\n    return len(nums) != len(set(nums))\n"
            }
        },
        {
            "title": "Product of Array Except Self",
            "slug": "product-of-array-except-self",
            "category": "Arrays & Hashing",
            "difficulty": "Medium",
            "problem_statement": "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i] in O(n) time without division.",
            "input_format": "nums = [1,2,3,4]",
            "output_format": "[24,12,8,6]",
            "constraints": "2 <= nums.length <= 10^5",
            "sample_cases": [{"input": "nums = [1,2,3,4]", "expected": "[24,12,8,6]"}],
            "hidden_cases": [{"input": "nums = [-1,1,0,-3,3]", "expected": "[0,0,9,0,0]"}],
            "templates": {
                "python": "def productExceptSelf(nums):\n    res = [1] * len(nums)\n    prefix = 1\n    for i in range(len(nums)):\n        res[i] = prefix\n        prefix *= nums[i]\n    postfix = 1\n    for i in range(len(nums) - 1, -1, -1):\n        res[i] *= postfix\n        postfix *= nums[i]\n    return res\n"
            }
        },
        {
            "title": "Maximum Subarray (Kadane's Algorithm)",
            "slug": "maximum-subarray",
            "category": "Arrays & Hashing",
            "difficulty": "Medium",
            "problem_statement": "Given an integer array nums, find the contiguous subarray with the largest sum, and return its sum.",
            "input_format": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
            "output_format": "6",
            "constraints": "1 <= nums.length <= 10^5",
            "sample_cases": [{"input": "nums = [-2,1,-3,4,-1,2,1,-5,4]", "expected": "6"}],
            "hidden_cases": [{"input": "nums = [5,4,-1,7,8]", "expected": "23"}],
            "templates": {
                "python": "def maxSubArray(nums):\n    max_sum = cur_sum = nums[0]\n    for n in nums[1:]:\n        cur_sum = max(n, cur_sum + n)\n        max_sum = max(max_sum, cur_sum)\n    return max_sum\n"
            }
        },
        {
            "title": "Top K Frequent Elements",
            "slug": "top-k-frequent-elements",
            "category": "Arrays & Hashing",
            "difficulty": "Medium",
            "problem_statement": "Given an integer array nums and an integer k, return the k most frequent elements in any order.",
            "input_format": "nums = [1,1,1,2,2,3], k = 2",
            "output_format": "[1, 2]",
            "constraints": "1 <= nums.length <= 10^5",
            "sample_cases": [{"input": "nums = [1,1,1,2,2,3], k = 2", "expected": "[1, 2]"}],
            "hidden_cases": [{"input": "nums = [1], k = 1", "expected": "[1]"}],
            "templates": {
                "python": "from collections import Counter\ndef topKFrequent(nums, k):\n    c = Counter(nums)\n    return [item[0] for item in c.most_common(k)]\n"
            }
        },
        {
            "title": "Group Anagrams",
            "slug": "group-anagrams",
            "category": "Arrays & Hashing",
            "difficulty": "Medium",
            "problem_statement": "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
            "input_format": "strs = ['eat','tea','tan','ate','nat','bat']",
            "output_format": "[['bat'],['nat','tan'],['ate','eat','tea']]",
            "constraints": "1 <= strs.length <= 10^4",
            "sample_cases": [{"input": "strs = ['eat','tea','tan','ate','nat','bat']", "expected": "[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]"}],
            "hidden_cases": [{"input": "strs = ['']", "expected": "[['']]"}],
            "templates": {
                "python": "from collections import defaultdict\ndef groupAnagrams(strs):\n    res = defaultdict(list)\n    for s in strs:\n        res[''.join(sorted(s))].append(s)\n    return list(res.values())\n"
            }
        },
        {
            "title": "Longest Consecutive Sequence",
            "slug": "longest-consecutive-sequence",
            "category": "Arrays & Hashing",
            "difficulty": "Medium",
            "problem_statement": "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence in O(n) runtime.",
            "input_format": "nums = [100,4,200,1,3,2]",
            "output_format": "4",
            "constraints": "0 <= nums.length <= 10^5",
            "sample_cases": [{"input": "nums = [100,4,200,1,3,2]", "expected": "4"}],
            "hidden_cases": [{"input": "nums = [0,3,7,2,5,8,4,6,0,1]", "expected": "9"}],
            "templates": {
                "python": "def longestConsecutive(nums):\n    num_set = set(nums)\n    longest = 0\n    for n in num_set:\n        if (n - 1) not in num_set:\n            length = 1\n            while (n + length) in num_set:\n                length += 1\n            longest = max(longest, length)\n    return longest\n"
            }
        },
        {
            "title": "Valid Sudoku",
            "slug": "valid-sudoku",
            "category": "Arrays & Hashing",
            "difficulty": "Medium",
            "problem_statement": "Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to standard rules.",
            "input_format": "board: 9x9 matrix",
            "output_format": "true",
            "constraints": "board.length == 9, board[i].length == 9",
            "sample_cases": [{"input": "standard valid board", "expected": "true"}],
            "hidden_cases": [],
            "templates": {
                "python": "def isValidSudoku(board):\n    rows = [set() for _ in range(9)]\n    cols = [set() for _ in range(9)]\n    boxes = [set() for _ in range(9)]\n    for r in range(9):\n        for c in range(9):\n            val = board[r][c]\n            if val == '.': continue\n            b_idx = (r // 3) * 3 + (c // 3)\n            if val in rows[r] or val in cols[c] or val in boxes[b_idx]:\n                return False\n            rows[r].add(val)\n            cols[c].add(val)\n            boxes[b_idx].add(val)\n    return True\n"
            }
        },
        {
            "title": "Encode and Decode Strings",
            "slug": "encode-and-decode-strings",
            "category": "Arrays & Hashing",
            "difficulty": "Medium",
            "problem_statement": "Design an algorithm to encode a list of strings to a single string, and decode that string back to the original list of strings.",
            "input_format": "['lint','code','love','you']",
            "output_format": "['lint','code','love','you']",
            "constraints": "0 <= strs.length <= 200",
            "sample_cases": [{"input": "['lint','code','love','you']", "expected": "['lint','code','love','you']"}],
            "hidden_cases": [],
            "templates": {
                "python": "def encode(strs):\n    return ''.join(f'{len(s)}#{s}' for s in strs)\ndef decode(s):\n    res, i = [], 0\n    while i < len(s):\n        j = s.find('#', i)\n        length = int(s[i:j])\n        res.append(s[j+1 : j+1+length])\n        i = j + 1 + length\n    return res\n"
            }
        },

        # Two Pointers & Sliding Window (8)
        {
            "title": "Valid Palindrome",
            "slug": "valid-palindrome",
            "category": "Two Pointers",
            "difficulty": "Easy",
            "problem_statement": "A phrase is a palindrome if, after converting all uppercase letters into lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.",
            "input_format": "s = 'A man, a plan, a canal: Panama'",
            "output_format": "true",
            "constraints": "1 <= s.length <= 2 * 10^5",
            "sample_cases": [{"input": "s = 'A man, a plan, a canal: Panama'", "expected": "true"}],
            "hidden_cases": [{"input": "s = 'race a car'", "expected": "false"}],
            "templates": {
                "python": "import re\ndef isPalindrome(s):\n    cleaned = re.sub(r'[^a-zA-Z0-9]', '', s).lower()\n    return cleaned == cleaned[::-1]\n"
            }
        },
        {
            "title": "3Sum",
            "slug": "3sum",
            "category": "Two Pointers",
            "difficulty": "Medium",
            "problem_statement": "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0 without duplicates.",
            "input_format": "nums = [-1,0,1,2,-1,-4]",
            "output_format": "[[-1,-1,2],[-1,0,1]]",
            "constraints": "3 <= nums.length <= 3000",
            "sample_cases": [{"input": "nums = [-1,0,1,2,-1,-4]", "expected": "[[-1,-1,2],[-1,0,1]]"}],
            "hidden_cases": [],
            "templates": {
                "python": "def threeSum(nums):\n    nums.sort()\n    res = []\n    for i in range(len(nums)-2):\n        if i > 0 and nums[i] == nums[i-1]: continue\n        l, r = i+1, len(nums)-1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s < 0: l += 1\n            elif s > 0: r -= 1\n            else:\n                res.append([nums[i], nums[l], nums[r]])\n                while l < r and nums[l] == nums[l+1]: l += 1\n                while l < r and nums[r] == nums[r-1]: r -= 1\n                l += 1; r -= 1\n    return res\n"
            }
        },
        {
            "title": "Container With Most Water",
            "slug": "container-with-most-water",
            "category": "Two Pointers",
            "difficulty": "Medium",
            "problem_statement": "You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water.",
            "input_format": "height = [1,8,6,2,5,4,8,3,7]",
            "output_format": "49",
            "constraints": "n == height.length, 2 <= n <= 10^5",
            "sample_cases": [{"input": "height = [1,8,6,2,5,4,8,3,7]", "expected": "49"}],
            "hidden_cases": [{"input": "height = [1,1]", "expected": "1"}],
            "templates": {
                "python": "def maxArea(height):\n    l, r = 0, len(height) - 1\n    max_w = 0\n    while l < r:\n        w = (r - l) * min(height[l], height[r])\n        max_w = max(max_w, w)\n        if height[l] < height[r]: l += 1\n        else: r -= 1\n    return max_w\n"
            }
        },
        {
            "title": "Trapping Rain Water",
            "slug": "trapping-rain-water",
            "category": "Two Pointers",
            "difficulty": "Hard",
            "problem_statement": "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
            "input_format": "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
            "output_format": "6",
            "constraints": "n == height.length, 1 <= n <= 2 * 10^4",
            "sample_cases": [{"input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]", "expected": "6"}],
            "hidden_cases": [{"input": "height = [4,2,0,3,2,5]", "expected": "9"}],
            "templates": {
                "python": "def trap(height):\n    if not height: return 0\n    l, r = 0, len(height) - 1\n    left_max, right_max = height[l], height[r]\n    water = 0\n    while l < r:\n        if left_max < right_max:\n            l += 1\n            left_max = max(left_max, height[l])\n            water += left_max - height[l]\n        else:\n            r -= 1\n            right_max = max(right_max, height[r])\n            water += right_max - height[r]\n    return water\n"
            }
        },
        {
            "title": "Longest Substring Without Repeating Characters",
            "slug": "longest-substring-without-repeating-characters",
            "category": "Sliding Window",
            "difficulty": "Medium",
            "problem_statement": "Given a string s, find the length of the longest substring without repeating characters.",
            "input_format": "s = 'abcabcbb'",
            "output_format": "3",
            "constraints": "0 <= s.length <= 5 * 10^4",
            "sample_cases": [{"input": "s = 'abcabcbb'", "expected": "3"}],
            "hidden_cases": [{"input": "s = 'bbbbb'", "expected": "1"}],
            "templates": {
                "python": "def lengthOfLongestSubstring(s):\n    char_map = {}\n    left = max_len = 0\n    for right, c in enumerate(s):\n        if c in char_map and char_map[c] >= left:\n            left = char_map[c] + 1\n        char_map[c] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len\n"
            }
        },
        {
            "title": "Longest Repeating Character Replacement",
            "slug": "longest-repeating-character-replacement",
            "category": "Sliding Window",
            "difficulty": "Medium",
            "problem_statement": "You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character at most k times. Return the length of the longest substring containing the same letter.",
            "input_format": "s = 'AABABBA', k = 1",
            "output_format": "4",
            "constraints": "1 <= s.length <= 10^5",
            "sample_cases": [{"input": "s = 'AABABBA', k = 1", "expected": "4"}],
            "hidden_cases": [],
            "templates": {
                "python": "def characterReplacement(s, k):\n    count = {}\n    max_f = left = max_len = 0\n    for right in range(len(s)):\n        count[s[right]] = count.get(s[right], 0) + 1\n        max_f = max(max_f, count[s[right]])\n        while (right - left + 1) - max_f > k:\n            count[s[left]] -= 1\n            left += 1\n        max_len = max(max_len, right - left + 1)\n    return max_len\n"
            }
        },
        {
            "title": "Minimum Window Substring",
            "slug": "minimum-window-substring",
            "category": "Sliding Window",
            "difficulty": "Hard",
            "problem_statement": "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.",
            "input_format": "s = 'ADOBECODEBANC', t = 'ABC'",
            "output_format": "'BANC'",
            "constraints": "m == s.length, n == t.length, 1 <= m, n <= 10^5",
            "sample_cases": [{"input": "s = 'ADOBECODEBANC', t = 'ABC'", "expected": "'BANC'"}],
            "hidden_cases": [],
            "templates": {
                "python": "from collections import Counter\ndef minWindow(s, t):\n    if not t or not s: return ''\n    t_count = Counter(t)\n    window = {}\n    have, need = 0, len(t_count)\n    res, res_len = [-1, -1], float('inf')\n    l = 0\n    for r in range(len(s)):\n        c = s[r]\n        window[c] = window.get(c, 0) + 1\n        if c in t_count and window[c] == t_count[c]: have += 1\n        while have == need:\n            if (r - l + 1) < res_len:\n                res = [l, r]\n                res_len = r - l + 1\n            window[s[l]] -= 1\n            if s[l] in t_count and window[s[l]] < t_count[s[l]]: have -= 1\n            l += 1\n    return s[res[0]:res[1]+1] if res_len != float('inf') else ''\n"
            }
        },
        {
            "title": "Sliding Window Maximum",
            "slug": "sliding-window-maximum",
            "category": "Sliding Window",
            "difficulty": "Hard",
            "problem_statement": "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. Return the max sliding window.",
            "input_format": "nums = [1,3,-1,-3,5,3,6,7], k = 3",
            "output_format": "[3,3,5,5,6,7]",
            "constraints": "1 <= nums.length <= 10^5, 1 <= k <= nums.length",
            "sample_cases": [{"input": "nums = [1,3,-1,-3,5,3,6,7], k = 3", "expected": "[3,3,5,5,6,7]"}],
            "hidden_cases": [],
            "templates": {
                "python": "from collections import deque\ndef maxSlidingWindow(nums, k):\n    q = deque()\n    res = []\n    for i, n in enumerate(nums):\n        while q and nums[q[-1]] < n:\n            q.pop()\n        q.append(i)\n        if q[0] <= i - k:\n            q.popleft()\n        if i >= k - 1:\n            res.append(nums[q[0]])\n    return res\n"
            }
        },

        # Stack & Queue (5)
        {
            "title": "Valid Parentheses",
            "slug": "valid-parentheses",
            "category": "Stack",
            "difficulty": "Easy",
            "problem_statement": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
            "input_format": "s = '()[]{}'",
            "output_format": "true",
            "constraints": "1 <= s.length <= 10^4",
            "sample_cases": [{"input": "s = '()[]{}'", "expected": "true"}],
            "hidden_cases": [{"input": "s = '(]'", "expected": "false"}],
            "templates": {
                "python": "def isValid(s):\n    stack = []\n    pairs = {')': '(', '}': '{', ']': '['}\n    for c in s:\n        if c in pairs:\n            if not stack or stack[-1] != pairs[c]: return False\n            stack.pop()\n        else:\n            stack.append(c)\n    return len(stack) == 0\n"
            }
        },
        {
            "title": "Min Stack",
            "slug": "min-stack",
            "category": "Stack",
            "difficulty": "Medium",
            "problem_statement": "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time O(1).",
            "input_format": "MinStack ops",
            "output_format": "Execution state",
            "constraints": "Methods pop, top and getMin operations will always be called on non-empty stacks.",
            "sample_cases": [{"input": "push(-2), push(0), push(-3), getMin()", "expected": "-3"}],
            "hidden_cases": [],
            "templates": {
                "python": "class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.min_stack = []\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        m = min(val, self.min_stack[-1] if self.min_stack else val)\n        self.min_stack.append(m)\n    def pop(self) -> None:\n        self.stack.pop()\n        self.min_stack.pop()\n    def top(self) -> int:\n        return self.stack[-1]\n    def getMin(self) -> int:\n        return self.min_stack[-1]\n"
            }
        },
        {
            "title": "Evaluate Reverse Polish Notation",
            "slug": "evaluate-reverse-polish-notation",
            "category": "Stack",
            "difficulty": "Medium",
            "problem_statement": "Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are +, -, *, and /.",
            "input_format": "tokens = ['2','1','+','3','*']",
            "output_format": "9",
            "constraints": "1 <= tokens.length <= 10^4",
            "sample_cases": [{"input": "tokens = ['2','1','+','3','*']", "expected": "9"}],
            "hidden_cases": [],
            "templates": {
                "python": "def evalRPN(tokens):\n    stack = []\n    for t in tokens:\n        if t not in '+-*/':\n            stack.append(int(t))\n        else:\n            b, a = stack.pop(), stack.pop()\n            if t == '+': stack.append(a + b)\n            elif t == '-': stack.append(a - b)\n            elif t == '*': stack.append(a * b)\n            elif t == '/': stack.append(int(a / b))\n    return stack[0]\n"
            }
        },
        {
            "title": "Daily Temperatures",
            "slug": "daily-temperatures",
            "category": "Stack",
            "difficulty": "Medium",
            "problem_statement": "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.",
            "input_format": "temperatures = [73,74,75,71,69,72,76,73]",
            "output_format": "[1,1,4,2,1,1,0,0]",
            "constraints": "1 <= temperatures.length <= 10^5",
            "sample_cases": [{"input": "temperatures = [73,74,75,71,69,72,76,73]", "expected": "[1,1,4,2,1,1,0,0]"}],
            "hidden_cases": [],
            "templates": {
                "python": "def dailyTemperatures(temperatures):\n    res = [0] * len(temperatures)\n    stack = [] # (temp, index)\n    for i, t in enumerate(temperatures):\n        while stack and t > stack[-1][0]:\n            _, prev_i = stack.pop()\n            res[prev_i] = i - prev_i\n        stack.append((t, i))\n    return res\n"
            }
        },
        {
            "title": "Largest Rectangle in Histogram",
            "slug": "largest-rectangle-in-histogram",
            "category": "Stack",
            "difficulty": "Hard",
            "problem_statement": "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
            "input_format": "heights = [2,1,5,6,2,3]",
            "output_format": "10",
            "constraints": "1 <= heights.length <= 10^5",
            "sample_cases": [{"input": "heights = [2,1,5,6,2,3]", "expected": "10"}],
            "hidden_cases": [],
            "templates": {
                "python": "def largestRectangleArea(heights):\n    max_area = 0\n    stack = [] # (index, height)\n    for i, h in enumerate(heights):\n        start = i\n        while stack and stack[-1][1] > h:\n            idx, height = stack.pop()\n            max_area = max(max_area, height * (i - idx))\n            start = idx\n        stack.append((start, h))\n    for idx, height in stack:\n        max_area = max(max_area, height * (len(heights) - idx))\n    return max_area\n"
            }
        },

        # Binary Search (5)
        {
            "title": "Binary Search",
            "slug": "binary-search",
            "category": "Binary Search",
            "difficulty": "Easy",
            "problem_statement": "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums in O(log n) runtime.",
            "input_format": "nums = [-1,0,3,5,9,12], target = 9",
            "output_format": "4",
            "constraints": "1 <= nums.length <= 10^4",
            "sample_cases": [{"input": "nums = [-1,0,3,5,9,12], target = 9", "expected": "4"}],
            "hidden_cases": [{"input": "nums = [-1,0,3,5,9,12], target = 2", "expected": "-1"}],
            "templates": {
                "python": "def search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target: return mid\n        elif nums[mid] < target: l = mid + 1\n        else: r = mid - 1\n    return -1\n"
            }
        },
        {
            "title": "Search a 2D Matrix",
            "slug": "search-a-2d-matrix",
            "category": "Binary Search",
            "difficulty": "Medium",
            "problem_statement": "You are given an m x n integer matrix matrix with the following two properties: each row is sorted in non-decreasing order and the first integer of each row is greater than the last integer of the previous row. Return true if target is in matrix.",
            "input_format": "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3",
            "output_format": "true",
            "constraints": "m == matrix.length, n == matrix[i].length",
            "sample_cases": [{"input": "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", "expected": "true"}],
            "hidden_cases": [],
            "templates": {
                "python": "def searchMatrix(matrix, target):\n    m, n = len(matrix), len(matrix[0])\n    l, r = 0, m * n - 1\n    while l <= r:\n        mid = (l + r) // 2\n        val = matrix[mid // n][mid % n]\n        if val == target: return True\n        elif val < target: l = mid + 1\n        else: r = mid - 1\n    return False\n"
            }
        },
        {
            "title": "Koko Eating Bananas",
            "slug": "koko-eating-bananas",
            "category": "Binary Search",
            "difficulty": "Medium",
            "problem_statement": "Koko loves to eat bananas. There are n piles of bananas. Return the minimum integer k such that she can eat all the bananas within h hours.",
            "input_format": "piles = [3,6,7,11], h = 8",
            "output_format": "4",
            "constraints": "1 <= piles.length <= 10^4, piles.length <= h <= 10^9",
            "sample_cases": [{"input": "piles = [3,6,7,11], h = 8", "expected": "4"}],
            "hidden_cases": [],
            "templates": {
                "python": "import math\ndef minEatingSpeed(piles, h):\n    l, r = 1, max(piles)\n    res = r\n    while l <= r:\n        k = (l + r) // 2\n        hours = sum(math.ceil(p / k) for p in piles)\n        if hours <= h:\n            res = k\n            r = k - 1\n        else:\n            l = k + 1\n    return res\n"
            }
        },
        {
            "title": "Find Minimum in Rotated Sorted Array",
            "slug": "find-minimum-in-rotated-sorted-array",
            "category": "Binary Search",
            "difficulty": "Medium",
            "problem_statement": "Given the sorted rotated array nums of unique elements, return the minimum element of this array in O(log n) time.",
            "input_format": "nums = [3,4,5,1,2]",
            "output_format": "1",
            "constraints": "n == nums.length, 1 <= n <= 5000",
            "sample_cases": [{"input": "nums = [3,4,5,1,2]", "expected": "1"}],
            "hidden_cases": [{"input": "nums = [4,5,6,7,0,1,2]", "expected": "0"}],
            "templates": {
                "python": "def findMin(nums):\n    l, r = 0, len(nums) - 1\n    while l < r:\n        mid = (l + r) // 2\n        if nums[mid] > nums[r]: l = mid + 1\n        else: r = mid\n    return nums[l]\n"
            }
        },
        {
            "title": "Search in Rotated Sorted Array",
            "slug": "search-in-rotated-sorted-array",
            "category": "Binary Search",
            "difficulty": "Medium",
            "problem_statement": "Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
            "input_format": "nums = [4,5,6,7,0,1,2], target = 0",
            "output_format": "4",
            "constraints": "1 <= nums.length <= 5000",
            "sample_cases": [{"input": "nums = [4,5,6,7,0,1,2], target = 0", "expected": "4"}],
            "hidden_cases": [],
            "templates": {
                "python": "def search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target: return mid\n        if nums[l] <= nums[mid]:\n            if nums[l] <= target < nums[mid]: r = mid - 1\n            else: l = mid + 1\n        else:\n            if nums[mid] < target <= nums[r]: l = mid + 1\n            else: r = mid - 1\n    return -1\n"
            }
        },

        # Linked Lists (5)
        {
            "title": "Reverse Linked List",
            "slug": "reverse-linked-list",
            "category": "Linked Lists",
            "difficulty": "Easy",
            "problem_statement": "Given the head of a singly linked list, reverse the list, and return the reversed list.",
            "input_format": "head = [1,2,3,4,5]",
            "output_format": "[5,4,3,2,1]",
            "constraints": "The number of nodes in the list is the range [0, 5000].",
            "sample_cases": [{"input": "head = [1,2,3,4,5]", "expected": "[5,4,3,2,1]"}],
            "hidden_cases": [],
            "templates": {
                "python": "def reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev\n"
            }
        },
        {
            "title": "Merge Two Sorted Lists",
            "slug": "merge-two-sorted-lists",
            "category": "Linked Lists",
            "difficulty": "Easy",
            "problem_statement": "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.",
            "input_format": "list1 = [1,2,4], list2 = [1,3,4]",
            "output_format": "[1,1,2,3,4,4]",
            "constraints": "The number of nodes in both lists is in the range [0, 50].",
            "sample_cases": [{"input": "list1 = [1,2,4], list2 = [1,3,4]", "expected": "[1,1,2,3,4,4]"}],
            "hidden_cases": [],
            "templates": {
                "python": "def mergeTwoLists(list1, list2):\n    dummy = ListNode()\n    tail = dummy\n    while list1 and list2:\n        if list1.val < list2.val:\n            tail.next = list1\n            list1 = list1.next\n        else:\n            tail.next = list2\n            list2 = list2.next\n        tail = tail.next\n    tail.next = list1 or list2\n    return dummy.next\n"
            }
        },
        {
            "title": "Reorder List",
            "slug": "reorder-list",
            "category": "Linked Lists",
            "difficulty": "Medium",
            "problem_statement": "You are given the head of a singly linked-list. Reorder the list to be on the following form: L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …",
            "input_format": "head = [1,2,3,4]",
            "output_format": "[1,4,2,3]",
            "constraints": "The number of nodes in the list is in the range [1, 5 * 10^4].",
            "sample_cases": [{"input": "head = [1,2,3,4]", "expected": "[1,4,2,3]"}],
            "hidden_cases": [],
            "templates": {
                "python": "def reorderList(head):\n    slow, fast = head, head.next\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    second = slow.next\n    slow.next = None\n    prev = None\n    while second:\n        nxt = second.next\n        second.next = prev\n        prev = second\n        second = nxt\n    first, second = head, prev\n    while second:\n        tmp1, tmp2 = first.next, second.next\n        first.next = second\n        second.next = tmp1\n        first, second = tmp1, tmp2\n"
            }
        },
        {
            "title": "Remove Nth Node From End of List",
            "slug": "remove-nth-node-from-end-of-list",
            "category": "Linked Lists",
            "difficulty": "Medium",
            "problem_statement": "Given the head of a linked list, remove the nth node from the end of the list and return its head in one pass.",
            "input_format": "head = [1,2,3,4,5], n = 2",
            "output_format": "[1,2,3,5]",
            "constraints": "The number of nodes in the list is sz. 1 <= sz <= 30",
            "sample_cases": [{"input": "head = [1,2,3,4,5], n = 2", "expected": "[1,2,3,5]"}],
            "hidden_cases": [],
            "templates": {
                "python": "def removeNthFromEnd(head, n):\n    dummy = ListNode(0, head)\n    left = dummy\n    right = head\n    while n > 0 and right:\n        right = right.next\n        n -= 1\n    while right:\n        left = left.next\n        right = right.next\n    left.next = left.next.next\n    return dummy.next\n"
            }
        },
        {
            "title": "Linked List Cycle",
            "slug": "linked-list-cycle",
            "category": "Linked Lists",
            "difficulty": "Easy",
            "problem_statement": "Given head, the head of a linked list, determine if the linked list has a cycle in it using Floyd's Tortoise and Hare algorithm.",
            "input_format": "head = [3,2,0,-4], pos = 1",
            "output_format": "true",
            "constraints": "The number of the nodes in the list is in the range [0, 10^4].",
            "sample_cases": [{"input": "head = [3,2,0,-4], pos = 1", "expected": "true"}],
            "hidden_cases": [],
            "templates": {
                "python": "def hasCycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast: return True\n    return False\n"
            }
        },

        # Trees & Binary Search Trees (8)
        {
            "title": "Invert Binary Tree",
            "slug": "invert-binary-tree",
            "category": "Trees",
            "difficulty": "Easy",
            "problem_statement": "Given the root of a binary tree, invert the tree, and return its root.",
            "input_format": "root = [4,2,7,1,3,6,9]",
            "output_format": "[4,7,2,9,6,3,1]",
            "constraints": "The number of nodes in the tree is in the range [0, 100].",
            "sample_cases": [{"input": "root = [4,2,7,1,3,6,9]", "expected": "[4,7,2,9,6,3,1]"}],
            "hidden_cases": [],
            "templates": {
                "python": "def invertTree(root):\n    if not root: return None\n    root.left, root.right = invertTree(root.right), invertTree(root.left)\n    return root\n"
            }
        },
        {
            "title": "Maximum Depth of Binary Tree",
            "slug": "maximum-depth-of-binary-tree",
            "category": "Trees",
            "difficulty": "Easy",
            "problem_statement": "Given the root of a binary tree, return its maximum depth.",
            "input_format": "root = [3,9,20,null,null,15,7]",
            "output_format": "3",
            "constraints": "The number of nodes in the tree is in the range [0, 10^4].",
            "sample_cases": [{"input": "root = [3,9,20,null,null,15,7]", "expected": "3"}],
            "hidden_cases": [],
            "templates": {
                "python": "def maxDepth(root):\n    if not root: return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))\n"
            }
        },
        {
            "title": "Diameter of Binary Tree",
            "slug": "diameter-of-binary-tree",
            "category": "Trees",
            "difficulty": "Easy",
            "problem_statement": "Given the root of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes.",
            "input_format": "root = [1,2,3,4,5]",
            "output_format": "3",
            "constraints": "The number of nodes in the tree is in the range [1, 10^4].",
            "sample_cases": [{"input": "root = [1,2,3,4,5]", "expected": "3"}],
            "hidden_cases": [],
            "templates": {
                "python": "def diameterOfBinaryTree(root):\n    res = [0]\n    def dfs(node):\n        if not node: return 0\n        left, right = dfs(node.left), dfs(node.right)\n        res[0] = max(res[0], left + right)\n        return 1 + max(left, right)\n    dfs(root)\n    return res[0]\n"
            }
        },
        {
            "title": "Balanced Binary Tree",
            "slug": "balanced-binary-tree",
            "category": "Trees",
            "difficulty": "Easy",
            "problem_statement": "Given a binary tree, determine if it is height-balanced (a binary tree in which the depth of the two subtrees of every node never differs by more than one).",
            "input_format": "root = [3,9,20,null,null,15,7]",
            "output_format": "true",
            "constraints": "The number of nodes in the tree is in the range [0, 5000].",
            "sample_cases": [{"input": "root = [3,9,20,null,null,15,7]", "expected": "true"}],
            "hidden_cases": [],
            "templates": {
                "python": "def isBalanced(root):\n    def dfs(node):\n        if not node: return [True, 0]\n        left, right = dfs(node.left), dfs(node.right)\n        balanced = left[0] and right[0] and abs(left[1] - right[1]) <= 1\n        return [balanced, 1 + max(left[1], right[1])]\n    return dfs(root)[0]\n"
            }
        },
        {
            "title": "Lowest Common Ancestor of a BST",
            "slug": "lowest-common-ancestor-of-a-bst",
            "category": "Trees",
            "difficulty": "Medium",
            "problem_statement": "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes p and q.",
            "input_format": "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8",
            "output_format": "6",
            "constraints": "All Node.val are unique. p != q.",
            "sample_cases": [{"input": "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8", "expected": "6"}],
            "hidden_cases": [],
            "templates": {
                "python": "def lowestCommonAncestor(root, p, q):\n    curr = root\n    while curr:\n        if p.val > curr.val and q.val > curr.val: curr = curr.right\n        elif p.val < curr.val and q.val < curr.val: curr = curr.left\n        else: return curr\n"
            }
        },
        {
            "title": "Binary Tree Level Order Traversal",
            "slug": "binary-tree-level-order-traversal",
            "category": "Trees",
            "difficulty": "Medium",
            "problem_statement": "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
            "input_format": "root = [3,9,20,null,null,15,7]",
            "output_format": "[[3],[9,20],[15,7]]",
            "constraints": "The number of nodes in the tree is in the range [0, 2000].",
            "sample_cases": [{"input": "root = [3,9,20,null,null,15,7]", "expected": "[[3],[9,20],[15,7]]"}],
            "hidden_cases": [],
            "templates": {
                "python": "from collections import deque\ndef levelOrder(root):\n    if not root: return []\n    q = deque([root])\n    res = []\n    while q:\n        level = []\n        for _ in range(len(q)):\n            node = q.popleft()\n            level.append(node.val)\n            if node.left: q.append(node.left)\n            if node.right: q.append(node.right)\n        res.append(level)\n    return res\n"
            }
        },
        {
            "title": "Validate Binary Search Tree",
            "slug": "validate-binary-search-tree",
            "category": "Trees",
            "difficulty": "Medium",
            "problem_statement": "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
            "input_format": "root = [2,1,3]",
            "output_format": "true",
            "constraints": "The number of nodes in the tree is in the range [1, 10^4].",
            "sample_cases": [{"input": "root = [2,1,3]", "expected": "true"}],
            "hidden_cases": [{"input": "root = [5,1,4,null,null,3,6]", "expected": "false"}],
            "templates": {
                "python": "def isValidBST(root):\n    def validate(node, low=-float('inf'), high=float('inf')):\n        if not node: return True\n        if not (low < node.val < high): return False\n        return validate(node.left, low, node.val) and validate(node.right, node.val, high)\n    return validate(root)\n"
            }
        },
        {
            "title": "Serialize and Deserialize Binary Tree",
            "slug": "serialize-and-deserialize-binary-tree",
            "category": "Trees",
            "difficulty": "Hard",
            "problem_statement": "Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work.",
            "input_format": "root = [1,2,3,null,null,4,5]",
            "output_format": "[1,2,3,null,null,4,5]",
            "constraints": "The number of nodes in the tree is in the range [0, 10^4].",
            "sample_cases": [{"input": "root = [1,2,3,null,null,4,5]", "expected": "valid tree output"}],
            "hidden_cases": [],
            "templates": {
                "python": "class Codec:\n    def serialize(self, root):\n        res = []\n        def dfs(node):\n            if not node: res.append('N'); return\n            res.append(str(node.val))\n            dfs(node.left); dfs(node.right)\n        dfs(root)\n        return ','.join(res)\n    def deserialize(self, data):\n        vals = data.split(',')\n        self.i = 0\n        def dfs():\n            if vals[self.i] == 'N': self.i += 1; return None\n            node = TreeNode(int(vals[self.i]))\n            self.i += 1\n            node.left = dfs(); node.right = dfs()\n            return node\n        return dfs()\n"
            }
        },

        # Graphs (5)
        {
            "title": "Number of Islands",
            "slug": "number-of-islands",
            "category": "Graphs",
            "difficulty": "Medium",
            "problem_statement": "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
            "input_format": "grid of 1s and 0s",
            "output_format": "1",
            "constraints": "m == grid.length, n == grid[i].length",
            "sample_cases": [{"input": "[['1','1','0'],['1','1','0'],['0','0','1']]", "expected": "2"}],
            "hidden_cases": [],
            "templates": {
                "python": "def numIslands(grid):\n    if not grid: return 0\n    rows, cols = len(grid), len(grid[0])\n    islands = 0\n    def dfs(r, c):\n        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1': return\n        grid[r][c] = '0'\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                dfs(r, c)\n                islands += 1\n    return islands\n"
            }
        },
        {
            "title": "Clone Graph",
            "slug": "clone-graph",
            "category": "Graphs",
            "difficulty": "Medium",
            "problem_statement": "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.",
            "input_format": "adjList = [[2,4],[1,3],[2,4],[1,3]]",
            "output_format": "[[2,4],[1,3],[2,4],[1,3]]",
            "constraints": "The number of nodes in the graph is in the range [0, 100].",
            "sample_cases": [{"input": "adjList = [[2,4],[1,3],[2,4],[1,3]]", "expected": "deep clone copy"}],
            "hidden_cases": [],
            "templates": {
                "python": "def cloneGraph(node):\n    if not node: return None\n    old_to_new = {}\n    def dfs(n):\n        if n in old_to_new: return old_to_new[n]\n        copy = Node(n.val)\n        old_to_new[n] = copy\n        for nei in n.neighbors:\n            copy.neighbors.append(dfs(nei))\n        return copy\n    return dfs(node)\n"
            }
        },
        {
            "title": "Course Schedule (Topological Sort)",
            "slug": "course-schedule",
            "category": "Graphs",
            "difficulty": "Medium",
            "problem_statement": "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites. Return true if you can finish all courses.",
            "input_format": "numCourses = 2, prerequisites = [[1,0]]",
            "output_format": "true",
            "constraints": "1 <= numCourses <= 2000",
            "sample_cases": [{"input": "numCourses = 2, prerequisites = [[1,0]]", "expected": "true"}],
            "hidden_cases": [{"input": "numCourses = 2, prerequisites = [[1,0],[0,1]]", "expected": "false"}],
            "templates": {
                "python": "def canFinish(numCourses, prerequisites):\n    preMap = {i: [] for i in range(numCourses)}\n    for crs, pre in prerequisites: preMap[crs].append(pre)\n    visited = set()\n    def dfs(crs):\n        if crs in visited: return False\n        if preMap[crs] == []: return True\n        visited.add(crs)\n        for pre in preMap[crs]:\n            if not dfs(pre): return False\n        visited.remove(crs)\n        preMap[crs] = []\n        return True\n    for c in range(numCourses):\n        if not dfs(c): return False\n    return True\n"
            }
        },
        {
            "title": "Pacific Atlantic Water Flow",
            "slug": "pacific-atlantic-water-flow",
            "category": "Graphs",
            "difficulty": "Medium",
            "problem_statement": "Return a 2D list of grid coordinates result where result[i] = [ri, ci] denotes that rain water can flow from cell (ri, ci) to both the Pacific and Atlantic oceans.",
            "input_format": "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
            "output_format": "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
            "constraints": "m == heights.length, n == heights[r].length",
            "sample_cases": [{"input": "heights matrix", "expected": "valid cells"}],
            "hidden_cases": [],
            "templates": {
                "python": "def pacificAtlantic(heights):\n    rows, cols = len(heights), len(heights[0])\n    pac, atl = set(), set()\n    def dfs(r, c, visit, prevHeight):\n        if (r, c) in visit or r < 0 or c < 0 or r == rows or c == cols or heights[r][c] < prevHeight: return\n        visit.add((r, c))\n        dfs(r+1, c, visit, heights[r][c]); dfs(r-1, c, visit, heights[r][c])\n        dfs(r, c+1, visit, heights[r][c]); dfs(r, c-1, visit, heights[r][c])\n    for c in range(cols):\n        dfs(0, c, pac, heights[0][c])\n        dfs(rows-1, c, atl, heights[rows-1][c])\n    for r in range(rows):\n        dfs(r, 0, pac, heights[r][0])\n        dfs(r, cols-1, atl, heights[r][cols-1])\n    return list(pac.intersection(atl))\n"
            }
        },
        {
            "title": "Word Ladder",
            "slug": "word-ladder",
            "category": "Graphs",
            "difficulty": "Hard",
            "problem_statement": "Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.",
            "input_format": "beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log','cog']",
            "output_format": "5",
            "constraints": "1 <= beginWord.length <= 10",
            "sample_cases": [{"input": "beginWord = 'hit', endWord = 'cog', wordList = ['hot','dot','dog','lot','log','cog']", "expected": "5"}],
            "hidden_cases": [],
            "templates": {
                "python": "from collections import deque, defaultdict\ndef ladderLength(beginWord, endWord, wordList):\n    if endWord not in wordList: return 0\n    nei = defaultdict(list)\n    wordList.append(beginWord)\n    for word in wordList:\n        for j in range(len(word)):\n            pattern = word[:j] + '*' + word[j+1:]\n            nei[pattern].append(word)\n    q = deque([beginWord])\n    visited = {beginWord}\n    res = 1\n    while q:\n        for _ in range(len(q)):\n            w = q.popleft()\n            if w == endWord: return res\n            for j in range(len(w)):\n                pattern = w[:j] + '*' + w[j+1:]\n                for neighbor in nei[pattern]:\n                    if neighbor not in visited:\n                        visited.add(neighbor)\n                        q.append(neighbor)\n        res += 1\n    return 0\n"
            }
        },

        # Dynamic Programming (7)
        {
            "title": "Climbing Stairs",
            "slug": "climbing-stairs",
            "category": "Dynamic Programming",
            "difficulty": "Easy",
            "problem_statement": "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
            "input_format": "n = 3",
            "output_format": "3",
            "constraints": "1 <= n <= 45",
            "sample_cases": [{"input": "n = 3", "expected": "3"}],
            "hidden_cases": [{"input": "n = 2", "expected": "2"}],
            "templates": {
                "python": "def climbStairs(n):\n    one, two = 1, 1\n    for _ in range(n - 1):\n        one, two = one + two, one\n    return one\n"
            }
        },
        {
            "title": "Coin Change",
            "slug": "coin-change",
            "category": "Dynamic Programming",
            "difficulty": "Medium",
            "problem_statement": "You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins that you need to make up that amount.",
            "input_format": "coins = [1,2,5], amount = 11",
            "output_format": "3",
            "constraints": "1 <= coins.length <= 12, 0 <= amount <= 10^4",
            "sample_cases": [{"input": "coins = [1,2,5], amount = 11", "expected": "3"}],
            "hidden_cases": [{"input": "coins = [2], amount = 3", "expected": "-1"}],
            "templates": {
                "python": "def coinChange(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if a - c >= 0:\n                dp[a] = min(dp[a], 1 + dp[a - c])\n    return dp[amount] if dp[amount] != float('inf') else -1\n"
            }
        },
        {
            "title": "Longest Increasing Subsequence",
            "slug": "longest-increasing-subsequence",
            "category": "Dynamic Programming",
            "difficulty": "Medium",
            "problem_statement": "Given an integer array nums, return the length of the longest strictly increasing subsequence in O(n log n) or O(n^2).",
            "input_format": "nums = [10,9,2,5,3,7,101,18]",
            "output_format": "4",
            "constraints": "1 <= nums.length <= 2500",
            "sample_cases": [{"input": "nums = [10,9,2,5,3,7,101,18]", "expected": "4"}],
            "hidden_cases": [],
            "templates": {
                "python": "def lengthOfLIS(nums):\n    dp = [1] * len(nums)\n    for i in range(len(nums) - 1, -1, -1):\n        for j in range(i + 1, len(nums)):\n            if nums[i] < nums[j]:\n                dp[i] = max(dp[i], 1 + dp[j])\n    return max(dp)\n"
            }
        },
        {
            "title": "House Robber",
            "slug": "house-robber",
            "category": "Dynamic Programming",
            "difficulty": "Medium",
            "problem_statement": "You are a professional robber planning to rob houses along a street without alerting adjacent security systems. Determine the maximum amount of money you can rob tonight without alerting the police.",
            "input_format": "nums = [1,2,3,1]",
            "output_format": "4",
            "constraints": "1 <= nums.length <= 100",
            "sample_cases": [{"input": "nums = [1,2,3,1]", "expected": "4"}],
            "hidden_cases": [{"input": "nums = [2,7,9,3,1]", "expected": "12"}],
            "templates": {
                "python": "def rob(nums):\n    rob1, rob2 = 0, 0\n    for n in nums:\n        temp = max(n + rob1, rob2)\n        rob1 = rob2\n        rob2 = temp\n    return rob2\n"
            }
        },
        {
            "title": "Word Break",
            "slug": "word-break",
            "category": "Dynamic Programming",
            "difficulty": "Medium",
            "problem_statement": "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
            "input_format": "s = 'leetcode', wordDict = ['leet','code']",
            "output_format": "true",
            "constraints": "1 <= s.length <= 300",
            "sample_cases": [{"input": "s = 'leetcode', wordDict = ['leet','code']", "expected": "true"}],
            "hidden_cases": [],
            "templates": {
                "python": "def wordBreak(s, wordDict):\n    dp = [False] * (len(s) + 1)\n    dp[len(s)] = True\n    for i in range(len(s) - 1, -1, -1):\n        for w in wordDict:\n            if (i + len(w)) <= len(s) and s[i : i + len(w)] == w:\n                dp[i] = dp[i + len(w)]\n            if dp[i]: break\n    return dp[0]\n"
            }
        },
        {
            "title": "Longest Common Subsequence",
            "slug": "longest-common-subsequence",
            "category": "Dynamic Programming",
            "difficulty": "Medium",
            "problem_statement": "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.",
            "input_format": "text1 = 'abcde', text2 = 'ace'",
            "output_format": "3",
            "constraints": "1 <= text1.length, text2.length <= 1000",
            "sample_cases": [{"input": "text1 = 'abcde', text2 = 'ace'", "expected": "3"}],
            "hidden_cases": [],
            "templates": {
                "python": "def longestCommonSubsequence(text1, text2):\n    dp = [[0 for _ in range(len(text2) + 1)] for _ in range(len(text1) + 1)]\n    for i in range(len(text1) - 1, -1, -1):\n        for j in range(len(text2) - 1, -1, -1):\n            if text1[i] == text2[j]: dp[i][j] = 1 + dp[i+1][j+1]\n            else: dp[i][j] = max(dp[i+1][j], dp[i][j+1])\n    return dp[0][0]\n"
            }
        },
        {
            "title": "0/1 Knapsack Problem",
            "slug": "01-knapsack-problem",
            "category": "Dynamic Programming",
            "difficulty": "Medium",
            "problem_statement": "Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack.",
            "input_format": "W = 50, val = [60, 100, 120], wt = [10, 20, 30]",
            "output_format": "220",
            "constraints": "1 <= n <= 1000, 1 <= W <= 1000",
            "sample_cases": [{"input": "W = 50, val = [60, 100, 120], wt = [10, 20, 30]", "expected": "220"}],
            "hidden_cases": [],
            "templates": {
                "python": "def knapsack(W, wt, val, n):\n    dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]\n    for i in range(n + 1):\n        for w in range(W + 1):\n            if i == 0 or w == 0: dp[i][w] = 0\n            elif wt[i-1] <= w:\n                dp[i][w] = max(val[i-1] + dp[i-1][w-wt[i-1]], dp[i-1][w])\n            else: dp[i][w] = dp[i-1][w]\n    return dp[n][W]\n"
            }
        },

        # System Design & Data Structures (5)
        {
            "title": "LRU Cache Design",
            "slug": "lru-cache",
            "category": "System Design & Data Structures",
            "difficulty": "Hard",
            "problem_statement": "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) time complexity for get and put operations.",
            "input_format": "capacity = 2, put(1, 1), put(2, 2), get(1)",
            "output_format": "1",
            "constraints": "1 <= capacity <= 3000",
            "sample_cases": [{"input": "capacity = 2, put(1, 1), put(2, 2), get(1)", "expected": "1"}],
            "hidden_cases": [],
            "templates": {
                "python": "class Node:\n    def __init__(self, key, val):\n        self.key, self.val = key, val\n        self.prev = self.next = None\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.cache = {}\n        self.left, self.right = Node(0, 0), Node(0, 0)\n        self.left.next, self.right.prev = self.right, self.left\n    def remove(self, node):\n        prev, nxt = node.prev, node.next\n        prev.next, nxt.prev = nxt, prev\n    def insert(self, node):\n        prev, nxt = self.right.prev, self.right\n        prev.next = nxt.prev = node\n        node.prev, node.next = prev, nxt\n    def get(self, key: int) -> int:\n        if key in self.cache:\n            self.remove(self.cache[key])\n            self.insert(self.cache[key])\n            return self.cache[key].val\n        return -1\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache: self.remove(self.cache[key])\n        self.cache[key] = Node(key, value)\n        self.insert(self.cache[key])\n        if len(self.cache) > self.cap:\n            lru = self.left.next\n            self.remove(lru)\n            del self.cache[lru.key]\n"
            }
        },
        {
            "title": "LFU Cache Design",
            "slug": "lfu-cache",
            "category": "System Design & Data Structures",
            "difficulty": "Hard",
            "problem_statement": "Design and implement a data structure for a Least Frequently Used (LFU) cache with get and put in O(1) average time complexity.",
            "input_format": "capacity = 2",
            "output_format": "Execution state",
            "constraints": "1 <= capacity <= 10^4",
            "sample_cases": [{"input": "put and get sequences", "expected": "valid output"}],
            "hidden_cases": [],
            "templates": {
                "python": "class LFUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n    def get(self, key: int) -> int:\n        return -1\n    def put(self, key: int, value: int) -> None:\n        pass\n"
            }
        },
        {
            "title": "Design Twitter / Feed Service",
            "slug": "design-twitter",
            "category": "System Design & Data Structures",
            "difficulty": "Medium",
            "problem_statement": "Design a simplified version of Twitter where users can post tweets, follow/unfollow another user, and see the 10 most recent tweets in their news feed.",
            "input_format": "postTweet(1, 5), getNewsFeed(1)",
            "output_format": "[5]",
            "constraints": "1 <= userId, followerId, followeeId <= 500",
            "sample_cases": [{"input": "postTweet(1, 5), getNewsFeed(1)", "expected": "[5]"}],
            "hidden_cases": [],
            "templates": {
                "python": "from collections import defaultdict\nimport heapq\nclass Twitter:\n    def __init__(self):\n        self.count = 0\n        self.tweetMap = defaultdict(list)\n        self.followMap = defaultdict(set)\n    def postTweet(self, userId: int, tweetId: int) -> None:\n        self.tweetMap[userId].append((self.count, tweetId))\n        self.count -= 1\n    def getNewsFeed(self, userId: int):\n        minHeap = []\n        self.followMap[userId].add(userId)\n        for followeeId in self.followMap[userId]:\n            if followeeId in self.tweetMap:\n                index = len(self.tweetMap[followeeId]) - 1\n                count, tweetId = self.tweetMap[followeeId][index]\n                minHeap.append((count, tweetId, followeeId, index - 1))\n        heapq.heapify(minHeap)\n        res = []\n        while minHeap and len(res) < 10:\n            count, tweetId, followeeId, index = heapq.heappop(minHeap)\n            res.append(tweetId)\n            if index >= 0:\n                count, tweetId = self.tweetMap[followeeId][index]\n                heapq.heappush(minHeap, (count, tweetId, followeeId, index - 1))\n        return res\n    def follow(self, followerId: int, followeeId: int) -> None:\n        self.followMap[followerId].add(followeeId)\n    def unfollow(self, followerId: int, followeeId: int) -> None:\n        self.followMap[followerId].discard(followeeId)\n"
            }
        },
        {
            "title": "Implement Trie (Prefix Tree)",
            "slug": "implement-trie-prefix-tree",
            "category": "System Design & Data Structures",
            "difficulty": "Medium",
            "problem_statement": "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement Trie with insert, search, and startsWith.",
            "input_format": "insert('apple'), search('apple'), startsWith('app')",
            "output_format": "true, true",
            "constraints": "1 <= word.length, prefix.length <= 2000",
            "sample_cases": [{"input": "insert('apple'), search('apple'), startsWith('app')", "expected": "true, true"}],
            "hidden_cases": [],
            "templates": {
                "python": "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.end_of_word = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n    def insert(self, word: str) -> None:\n        cur = self.root\n        for c in word:\n            if c not in cur.children: cur.children[c] = TrieNode()\n            cur = cur.children[c]\n        cur.end_of_word = True\n    def search(self, word: str) -> bool:\n        cur = self.root\n        for c in word:\n            if c not in cur.children: return False\n            cur = cur.children[c]\n        return cur.end_of_word\n    def startsWith(self, prefix: str) -> bool:\n        cur = self.root\n        for c in prefix:\n            if c not in cur.children: return False\n            cur = cur.children[c]\n        return True\n"
            }
        },
        {
            "title": "Design In-Memory Key-Value Store with Transactions",
            "slug": "in-memory-key-value-store",
            "category": "System Design & Data Structures",
            "difficulty": "Hard",
            "problem_statement": "Design an in-memory transactional database that supports SET, GET, DELETE, BEGIN, COMMIT, and ROLLBACK with nested transactions.",
            "input_format": "BEGIN, SET x 10, ROLLBACK, GET x",
            "output_format": "null",
            "constraints": "O(1) lookups and transaction management",
            "sample_cases": [{"input": "BEGIN, SET x 10, ROLLBACK, GET x", "expected": "null"}],
            "hidden_cases": [],
            "templates": {
                "python": "class KVStore:\n    def __init__(self):\n        self.global_store = {}\n        self.transactions = [] # stack of diff dicts\n    def get(self, key):\n        for tx in reversed(self.transactions):\n            if key in tx:\n                return tx[key]\n        return self.global_store.get(key, None)\n    def set(self, key, val):\n        if self.transactions:\n            self.transactions[-1][key] = val\n        else:\n            self.global_store[key] = val\n    def begin(self):\n        self.transactions.append({})\n    def commit(self):\n        if not self.transactions: return False\n        active = self.transactions.pop()\n        for k, v in active.items():\n            self.set(k, v)\n        return True\n    def rollback(self):\n        if not self.transactions: return False\n        self.transactions.pop()\n        return True\n"
            }
        },

        # Backtracking & Bit Manipulation (5)
        {
            "title": "Subsets",
            "slug": "subsets",
            "category": "Backtracking",
            "difficulty": "Medium",
            "problem_statement": "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
            "input_format": "nums = [1,2,3]",
            "output_format": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
            "constraints": "1 <= nums.length <= 10",
            "sample_cases": [{"input": "nums = [1,2,3]", "expected": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]"}],
            "hidden_cases": [],
            "templates": {
                "python": "def subsets(nums):\n    res = []\n    subset = []\n    def dfs(i):\n        if i >= len(nums):\n            res.append(subset.copy())\n            return\n        subset.append(nums[i])\n        dfs(i + 1)\n        subset.pop()\n        dfs(i + 1)\n    dfs(0)\n    return res\n"
            }
        },
        {
            "title": "Permutations",
            "slug": "permutations",
            "category": "Backtracking",
            "difficulty": "Medium",
            "problem_statement": "Given an array nums of distinct integers, return all the possible permutations in any order.",
            "input_format": "nums = [1,2,3]",
            "output_format": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
            "constraints": "1 <= nums.length <= 6",
            "sample_cases": [{"input": "nums = [1,2,3]", "expected": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]"}],
            "hidden_cases": [],
            "templates": {
                "python": "def permute(nums):\n    res = []\n    if len(nums) == 1: return [nums[:]]\n    for _ in range(len(nums)):\n        n = nums.pop(0)\n        perms = permute(nums)\n        for p in perms: p.append(n)\n        res.extend(perms)\n        nums.append(n)\n    return res\n"
            }
        },
        {
            "title": "Combination Sum",
            "slug": "combination-sum",
            "category": "Backtracking",
            "difficulty": "Medium",
            "problem_statement": "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target.",
            "input_format": "candidates = [2,3,6,7], target = 7",
            "output_format": "[[2,2,3],[7]]",
            "constraints": "1 <= candidates.length <= 30",
            "sample_cases": [{"input": "candidates = [2,3,6,7], target = 7", "expected": "[[2,2,3],[7]]"}],
            "hidden_cases": [],
            "templates": {
                "python": "def combinationSum(candidates, target):\n    res = []\n    def dfs(i, cur, total):\n        if total == target: res.append(cur.copy()); return\n        if i >= len(candidates) or total > target: return\n        cur.append(candidates[i])\n        dfs(i, cur, total + candidates[i])\n        cur.pop()\n        dfs(i + 1, cur, total)\n    dfs(0, [], 0)\n    return res\n"
            }
        },
        {
            "title": "Number of 1 Bits (Hamming Weight)",
            "slug": "number-of-1-bits",
            "category": "Bit Manipulation",
            "difficulty": "Easy",
            "problem_statement": "Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (also known as the Hamming weight).",
            "input_format": "n = 11 (binary 1011)",
            "output_format": "3",
            "constraints": "1 <= n <= 2^31 - 1",
            "sample_cases": [{"input": "n = 11", "expected": "3"}],
            "hidden_cases": [],
            "templates": {
                "python": "def hammingWeight(n):\n    count = 0\n    while n:\n        n &= (n - 1)\n        count += 1\n    return count\n"
            }
        },
        {
            "title": "Single Number",
            "slug": "single-number",
            "category": "Bit Manipulation",
            "difficulty": "Easy",
            "problem_statement": "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one in O(n) runtime and O(1) extra space.",
            "input_format": "nums = [4,1,2,1,2]",
            "output_format": "4",
            "constraints": "1 <= nums.length <= 3 * 10^4",
            "sample_cases": [{"input": "nums = [4,1,2,1,2]", "expected": "4"}],
            "hidden_cases": [],
            "templates": {
                "python": "def singleNumber(nums):\n    res = 0\n    for n in nums: res ^= n\n    return res\n"
            }
        }
    ]
    return problems
