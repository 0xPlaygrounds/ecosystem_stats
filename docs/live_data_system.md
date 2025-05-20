├── .github
    └── workflows
    │   ├── run_metrics_bot.yml
    │   ├── run_weekly_metrics.yml
    │   └── update_posts.yml
├── .gitignore
├── achievements
    ├── github_achievements.py
    ├── telegram_achievements.py
    ├── token_holder_achievements.py
    └── x_follower_achievements.py
├── api
    ├── followers.py
    ├── github.py
    ├── holders.py
    ├── posts.py
    └── telegram.py
├── blocklists
    ├── ban_phrases.txt
    ├── delete_phrases.txt
    └── mute_phrases.txt
├── bot.py
├── combot
    ├── brand_assets.py
    └── scheduled_warnings.py
├── data
    ├── achievements
    │   ├── github_achievements.json
    │   ├── telegram_achievements.json
    │   ├── token_holder_achievements.json
    │   └── x_follower_achievements.json
    └── metrics
    │   ├── daily
    │       ├── github_metrics.json
    │       ├── telegram_metrics.json
    │       ├── token_holder_metrics.json
    │       └── x_follower_metrics.json
    │   └── weekly
    │       ├── github_weekly_metrics.json
    │       ├── telegram_weekly_metrics.json
    │       ├── token_holder_weekly_metrics.json
    │       └── x_follower_weekly_metrics.json
├── filters
    ├── filters.json
    ├── growth.json
    ├── metrics.json
    └── posts.json
├── media
    ├── aa#00.mp4
    ├── agenttank_handshake.mp4
    ├── alan_turing.mp4
    ├── arc_angels.mp4
    ├── arc_begins.mp4
    ├── arc_merch.mp4
    ├── arc_watching.mp4
    ├── arc_white.jpg
    ├── arc_x_tank.mp4
    ├── are_you_pilled_yet.mp4
    ├── build_rig.mp4
    ├── deluge
    │   └── arc_gif.mp4
    ├── emblem.mp4
    ├── fabelis_handshake.mp4
    ├── giveussol.mp4
    ├── handshake_complete.mp4
    ├── join_the_ryzome.mp4
    ├── make_me_smile.jpg
    ├── ready.mp4
    ├── rig_trading_kit.mp4
    ├── roadmap.jpg
    ├── search.mp4
    ├── sort_us_out.jpg
    ├── stay_curious.mp4
    ├── the_complex.mp4
    ├── the_prologue.mp4
    ├── wake_up_degen.mp4
    ├── we_arc.mp4
    ├── we_evolve.mp4
    ├── what_is_coming.mp4
    ├── what_is_it.mp4
    └── which_pill.jpg
├── metrics
    ├── daily
    │   └── metrics.py
    └── weekly
    │   └── metrics.py
├── middleware_listener.py
├── railway.json
├── requirements.txt
└── whitelists
    └── whitelist_phrases.txt


/.github/workflows/run_metrics_bot.yml:
--------------------------------------------------------------------------------
 1 | name: Run Metrics Bot and Sync Branches
 2 | 
 3 | on:
 4 |   schedule:
 5 |     - cron: "0 0 * * *"  # Every day at midnight UTC
 6 |   workflow_dispatch:
 7 | 
 8 | jobs:
 9 |   run-metrics-bot:
10 |     runs-on: ubuntu-latest
11 |     env:
12 |       TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
13 |       GROUP_CHAT_ID: ${{ secrets.GROUP_CHAT_ID }}
14 |       DISCORD_BOT_TOKEN: ${{ secrets.DISCORD_BOT_TOKEN }}
15 |       DISCORD_CHANNEL_ID: ${{ secrets.DISCORD_CHANNEL_ID }}
16 |       REPO: ${{ secrets.REPO }}
17 |       HELIUS_API_KEY: ${{ secrets.HELIUS_API_KEY }}
18 |       TOKEN_ADDRESS: ${{ secrets.TOKEN_ADDRESS }}
19 | 
20 |     steps:
21 |       - name: Checkout repo (fetch all branches)
22 |         uses: actions/checkout@v3
23 |         with:
24 |           token: ${{ secrets.GITHUB_TOKEN }}
25 |           fetch-depth: 0
26 | 
27 |       - name: Fetch all branches
28 |         run: git fetch --all
29 | 
30 |       - name: Set up Python 3.11
31 |         uses: actions/setup-python@v4
32 |         with:
33 |           python-version: '3.11'
34 | 
35 |       - name: Install dependencies
36 |         run: pip install -r requirements.txt
37 | 
38 |       - name: Install Playwright browsers
39 |         run: playwright install
40 | 
41 |       - name: Checkout staging branch
42 |         run: |
43 |           git checkout staging
44 |           git pull origin staging --rebase
45 | 
46 |       - name: Run metrics bot script
47 |         run: python metrics/daily/metrics.py
48 | 
49 |       - name: Configure Git
50 |         run: |
51 |           git config --global user.name "github-actions[bot]"
52 |           git config --global user.email "github-actions[bot]@users.noreply.github.com"
53 | 
54 |       - name: Commit and push changes to staging
55 |         run: |
56 |           git add .
57 |           if ! git diff --cached --quiet; then
58 |             git commit -m "update daily metrics"
59 |             git push origin staging
60 |           else
61 |             echo "No changes to commit on staging."
62 |           fi
63 | 
64 |       - name: Checkout main branch
65 |         run: |
66 |           git checkout main
67 |           git pull origin main --rebase
68 | 
69 |       - name: Merge staging into main (prefer staging changes)
70 |         run: |
71 |           git merge staging -X theirs --no-edit || {
72 |             echo "Merge failed, aborting."
73 |             git merge --abort
74 |             exit 1
75 |           }
76 | 
77 |       - name: Push changes to main
78 |         run: git push origin main
79 | 
80 | 


--------------------------------------------------------------------------------
/.github/workflows/run_weekly_metrics.yml:
--------------------------------------------------------------------------------
 1 | name: Run Weekly Metrics and Sync Branches
 2 | 
 3 | on:
 4 |   schedule:
 5 |     - cron: "0 3 * * 1"  # Every Monday at 3 AM UTC
 6 |   workflow_dispatch:
 7 | 
 8 | jobs:
 9 |   run-weekly-metrics:
10 |     runs-on: ubuntu-latest
11 | 
12 |     steps:
13 |       - name: Checkout repo (all branches)
14 |         uses: actions/checkout@v3
15 |         with:
16 |           token: ${{ secrets.GITHUB_TOKEN }}
17 |           fetch-depth: 0
18 | 
19 |       - name: Set up Python 3.11
20 |         uses: actions/setup-python@v4
21 |         with:
22 |           python-version: '3.11'
23 | 
24 |       - name: Install dependencies
25 |         run: pip install -r requirements.txt
26 | 
27 |       - name: Checkout staging branch
28 |         run: |
29 |           git checkout staging
30 |           git pull origin staging --rebase
31 | 
32 |       - name: Run weekly metrics summary
33 |         run: python metrics/weekly/metrics.py
34 | 
35 |       - name: Configure Git
36 |         run: |
37 |           git config --global user.name "github-actions[bot]"
38 |           git config --global user.email "github-actions[bot]@users.noreply.github.com"
39 | 
40 |       - name: Commit and push changes to staging
41 |         run: |
42 |           git add .
43 |           if ! git diff --cached --quiet; then
44 |             git commit -m "update weekly metrics"
45 |             git push origin staging
46 |           else
47 |             echo "No changes to commit on staging."
48 |           fi
49 | 
50 |       - name: Checkout main branch
51 |         run: |
52 |           git checkout main
53 |           git pull origin main --rebase
54 | 
55 |       - name: Merge staging into main (prefer staging changes)
56 |         run: |
57 |           git merge staging -X theirs --no-edit || {
58 |             echo "Merge failed, aborting."
59 |             git merge --abort
60 |             exit 1
61 |           }
62 | 
63 |       - name: Push changes to main
64 |         run: git push origin main


--------------------------------------------------------------------------------
/.github/workflows/update_posts.yml:
--------------------------------------------------------------------------------
 1 | name: Update Posts Data and Sync Branches
 2 | 
 3 | on:
 4 |   schedule:
 5 |     - cron: "0 0,12 * * *"  # At midnight UTC and noon UTC daily (twice per day)
 6 |   workflow_dispatch:
 7 | 
 8 | jobs:
 9 |   update-posts:
10 |     runs-on: ubuntu-latest
11 |     env:
12 |       TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
13 |       GROUP_CHAT_ID: ${{ secrets.GROUP_CHAT_ID }}
14 |       DISCORD_BOT_TOKEN: ${{ secrets.DISCORD_BOT_TOKEN }}
15 |       DISCORD_CHANNEL_ID: ${{ secrets.DISCORD_CHANNEL_ID }}
16 |       REPO: ${{ secrets.REPO }}
17 |       HELIUS_API_KEY: ${{ secrets.HELIUS_API_KEY }}
18 |       TOKEN_ADDRESS: ${{ secrets.TOKEN_ADDRESS }}
19 | 
20 |     steps:
21 |       - name: Checkout repo (fetch all branches)
22 |         uses: actions/checkout@v3
23 |         with:
24 |           token: ${{ secrets.GITHUB_TOKEN }}
25 |           fetch-depth: 0
26 | 
27 |       - name: Fetch all branches
28 |         run: git fetch --all
29 | 
30 |       - name: Set up Python 3.11
31 |         uses: actions/setup-python@v4
32 |         with:
33 |           python-version: '3.11'
34 | 
35 |       - name: Install dependencies
36 |         run: pip install -r requirements.txt
37 | 
38 |       - name: Install Playwright browsers
39 |         run: playwright install
40 | 
41 |       - name: Checkout staging branch
42 |         run: |
43 |           git checkout staging
44 |           git pull origin staging --rebase
45 | 
46 |       - name: Run posts update script
47 |         run: python api/posts.py
48 | 
49 |       - name: Configure Git
50 |         run: |
51 |           git config --global user.name "github-actions[bot]"
52 |           git config --global user.email "github-actions[bot]@users.noreply.github.com"
53 | 
54 |       - name: Commit and push changes to staging
55 |         run: |
56 |           git add .
57 |           if ! git diff --cached --quiet; then
58 |             git commit -m "fetch latest posts"
59 |             git push origin staging
60 |           else
61 |             echo "No changes to commit on staging."
62 |           fi
63 | 
64 |       - name: Checkout main branch
65 |         run: |
66 |           git checkout main
67 |           git pull origin main --rebase
68 | 
69 |       - name: Merge staging into main (prefer staging changes)
70 |         run: |
71 |           git merge staging -X theirs --no-edit || {
72 |             echo "Merge failed, aborting."
73 |             git merge --abort
74 |             exit 1
75 |           }
76 | 
77 |       - name: Push changes to main
78 |         run: git push origin main
79 | 


--------------------------------------------------------------------------------
/.gitignore:
--------------------------------------------------------------------------------
1 | .env
2 | __pycache__/
3 | *.pyc
4 | 
5 | # Python virtual environment
6 | venv/
7 | telegram-bot-env/
8 | 


--------------------------------------------------------------------------------
/achievements/github_achievements.py:
--------------------------------------------------------------------------------
  1 | import json
  2 | import os
  3 | from datetime import datetime, timezone
  4 | 
  5 | GITHUB_METRICS_FILE = "data/metrics/daily/github_metrics.json"
  6 | GITHUB_ACHIEVEMENTS_FILE = "data/achievements/github_achievements.json"
  7 | 
  8 | def load_json_file(filepath):
  9 |     if not os.path.exists(filepath):
 10 |         return {}
 11 |     try:
 12 |         with open(filepath, "r") as f:
 13 |             return json.load(f)
 14 |     except json.JSONDecodeError:
 15 |         return {}
 16 | 
 17 | def save_json_file(filepath, data):
 18 |     os.makedirs(os.path.dirname(filepath), exist_ok=True)
 19 |     with open(filepath, "w") as f:
 20 |         json.dump(data, f, indent=2)
 21 | 
 22 | def get_latest_metrics_entry(metrics):
 23 |     if not metrics.get("entries"):
 24 |         return None
 25 |     return sorted(metrics["entries"], key=lambda e: e["timestamp"], reverse=True)[0]
 26 | 
 27 | def detect_release_version_change(metrics):
 28 |     entries = metrics.get("entries", [])
 29 |     if len(entries) < 2:
 30 |         return False, None
 31 |     latest = sorted(entries, key=lambda e: e["timestamp"], reverse=True)[0]
 32 |     previous = sorted(entries, key=lambda e: e["timestamp"], reverse=True)[1]
 33 |     if latest["release_version"] != previous["release_version"]:
 34 |         return True, latest["release_version"]
 35 |     return False, None
 36 | 
 37 | def check_star_fork_milestones(latest_entry, achievements):
 38 |     milestones = []
 39 |     star_step = 1000
 40 |     fork_step = 100
 41 |     last_star = achievements.get("last_star_milestone", 0)
 42 |     last_fork = achievements.get("last_fork_milestone", 0)
 43 |     stars = latest_entry.get("stars", 0)
 44 |     forks = latest_entry.get("forks", 0)
 45 | 
 46 |     current_star = (stars // star_step) * star_step
 47 |     current_fork = (forks // fork_step) * fork_step
 48 | 
 49 |     if current_star > last_star:
 50 |         milestones.append(f"🎉 Github Star milestone reached: {current_star} stars!")
 51 |         achievements["last_star_milestone"] = current_star
 52 | 
 53 |     if current_fork > last_fork:
 54 |         milestones.append(f"🎉 Github Fork milestone reached: {current_fork} forks!")
 55 |         achievements["last_fork_milestone"] = current_fork
 56 | 
 57 |     return milestones, achievements
 58 | 
 59 | def check_github_achievements():
 60 |     metrics = load_json_file(GITHUB_METRICS_FILE)
 61 |     achievements = load_json_file(GITHUB_ACHIEVEMENTS_FILE)
 62 | 
 63 |     if not achievements:
 64 |         achievements = {
 65 |             "dataset_name": "github_achievements",
 66 |             "created_at": datetime.now(timezone.utc).isoformat(),
 67 |             "entries": [],
 68 |             "last_star_milestone": 0,
 69 |             "last_fork_milestone": 0,
 70 |             "last_release_version": None
 71 |         }
 72 | 
 73 |     latest_entry = get_latest_metrics_entry(metrics)
 74 |     if not latest_entry:
 75 |         print("No metrics data found.")
 76 |         return []
 77 | 
 78 |     new_achievements = []
 79 | 
 80 |     release_changed, new_version = detect_release_version_change(metrics)
 81 |     if release_changed and new_version != achievements.get("last_release_version"):
 82 |         msg = f"🎉 New rig-core version detected: {new_version}!"
 83 |         new_achievements.append(msg)
 84 |         achievements["last_release_version"] = new_version
 85 | 
 86 |     star_fork_msgs, achievements = check_star_fork_milestones(latest_entry, achievements)
 87 |     new_achievements.extend(star_fork_msgs)
 88 | 
 89 |     if new_achievements:
 90 |         achievement_entry = {
 91 |             "id": latest_entry["id"],
 92 |             "timestamp": latest_entry["timestamp"],
 93 |             "messages": new_achievements
 94 |         }
 95 |         achievements["entries"].append(achievement_entry)
 96 |         save_json_file(GITHUB_ACHIEVEMENTS_FILE, achievements)
 97 | 
 98 |     return new_achievements
 99 | 
100 | if __name__ == "__main__":
101 |     check_github_achievements()
102 | 


--------------------------------------------------------------------------------
/achievements/telegram_achievements.py:
--------------------------------------------------------------------------------
 1 | import json
 2 | import os
 3 | from datetime import datetime, timezone
 4 | 
 5 | TELEGRAM_METRICS_FILE = "data/metrics/daily/telegram_metrics.json"
 6 | TELEGRAM_ACHIEVEMENTS_FILE = "data/achievements/telegram_achievements.json"
 7 | 
 8 | def load_json_file(filepath):
 9 |     if not os.path.exists(filepath):
10 |         return {}
11 |     try:
12 |         with open(filepath, "r") as f:
13 |             data = json.load(f)
14 |             return data
15 |     except json.JSONDecodeError as e:
16 |         return {}
17 | 
18 | def save_json_file(filepath, data):
19 |     os.makedirs(os.path.dirname(filepath), exist_ok=True)
20 |     with open(filepath, "w") as f:
21 |         json.dump(data, f, indent=2)
22 | 
23 | def get_latest_metrics_entry(metrics):
24 |     entries = metrics.get("entries")
25 |     if not entries:
26 |         return None
27 |     # Sort by timestamp to get the latest entry
28 |     latest = sorted(entries, key=lambda e: e["timestamp"], reverse=True)[0]
29 |     return latest
30 | 
31 | def check_member_count_milestones(latest_entry, achievements):
32 |     milestones = []
33 |     member_milestone_step = 500
34 | 
35 |     last_member_milestone = achievements.get("last_member_milestone", 0)
36 |     member_count = latest_entry.get("member_count", 0)
37 | 
38 |     current_milestone = (member_count // member_milestone_step) * member_milestone_step
39 | 
40 |     if current_milestone > last_member_milestone:
41 |         msg = f"🎉 Telegram Member milestone reached: {current_milestone} members!"
42 |         milestones.append(msg)
43 |         achievements["last_member_milestone"] = current_milestone
44 | 
45 |     return milestones, achievements
46 | 
47 | def check_telegram_achievements():
48 |     metrics = load_json_file(TELEGRAM_METRICS_FILE)
49 |     achievements = load_json_file(TELEGRAM_ACHIEVEMENTS_FILE)
50 | 
51 |     if not achievements:
52 |         achievements = {
53 |             "dataset_name": "telegram_achievements",
54 |             "created_at": datetime.now(timezone.utc).isoformat(),
55 |             "entries": [],
56 |             "last_member_milestone": 0
57 |         }
58 | 
59 |     latest_entry = get_latest_metrics_entry(metrics)
60 |     if not latest_entry:
61 |         return []
62 | 
63 |     new_achievements = []
64 | 
65 |     milestone_msgs, achievements = check_member_count_milestones(latest_entry, achievements)
66 |     new_achievements.extend(milestone_msgs)
67 | 
68 |     if new_achievements:
69 |         achievement_entry = {
70 |             "id": latest_entry["id"],
71 |             "timestamp": latest_entry["timestamp"],
72 |             "messages": new_achievements
73 |         }
74 |         achievements["entries"].append(achievement_entry)
75 |         save_json_file(TELEGRAM_ACHIEVEMENTS_FILE, achievements)
76 | 
77 |     return new_achievements
78 | 
79 | if __name__ == "__main__":
80 |     check_telegram_achievements()


--------------------------------------------------------------------------------
/achievements/token_holder_achievements.py:
--------------------------------------------------------------------------------
 1 | import os
 2 | import json
 3 | from datetime import datetime, timezone
 4 | 
 5 | TOKEN_HOLDER_METRICS_FILE = "data/metrics/daily/token_holder_metrics.json"
 6 | TOKEN_HOLDER_ACHIEVEMENTS_FILE = "data/achievements/token_holder_achievements.json"
 7 | 
 8 | def load_json_file(filepath):
 9 |     if not os.path.exists(filepath):
10 |         return {}
11 |     try:
12 |         with open(filepath, "r") as f:
13 |             data = json.load(f)
14 |             return data
15 |     except json.JSONDecodeError as e:
16 |         return {}
17 | 
18 | def save_json_file(filepath, data):
19 |     os.makedirs(os.path.dirname(filepath), exist_ok=True)
20 |     with open(filepath, "w") as f:
21 |         json.dump(data, f, indent=2)
22 | 
23 | def get_latest_metrics_entry(metrics):
24 |     if not metrics.get("entries"):
25 |         return None
26 |     latest = sorted(metrics["entries"], key=lambda e: e["timestamp"], reverse=True)[0]
27 |     return latest
28 | 
29 | def check_holder_count_milestones(latest_entry, achievements):
30 |     milestones = []
31 |     holder_milestone_step = 1000  # Milestone every 1000 holders
32 | 
33 |     last_holder_milestone = achievements.get("last_holder_milestone", 0)
34 |     holder_count = latest_entry.get("holder_count", 0)
35 | 
36 |     current_milestone = (holder_count // holder_milestone_step) * holder_milestone_step
37 | 
38 |     if current_milestone > last_holder_milestone:
39 |         milestones.append(f"🎉 Token holder milestone reached: {current_milestone} holders!")
40 |         achievements["last_holder_milestone"] = current_milestone
41 | 
42 |     return milestones, achievements
43 | 
44 | def check_token_holder_achievements():
45 | 
46 |     metrics = load_json_file(TOKEN_HOLDER_METRICS_FILE)
47 |     achievements = load_json_file(TOKEN_HOLDER_ACHIEVEMENTS_FILE)
48 | 
49 |     if not achievements:
50 |         achievements = {
51 |             "dataset_name": "token_holder_achievements",
52 |             "created_at": datetime.now(timezone.utc).isoformat(),
53 |             "entries": [],
54 |             "last_holder_milestone": 0
55 |         }
56 | 
57 |     latest_entry = get_latest_metrics_entry(metrics)
58 |     if not latest_entry:
59 |         return []
60 | 
61 |     new_achievements = []
62 | 
63 |     milestone_msgs, achievements = check_holder_count_milestones(latest_entry, achievements)
64 |     new_achievements.extend(milestone_msgs)
65 | 
66 |     if new_achievements:
67 |         achievement_entry = {
68 |             "id": latest_entry.get("id", ""),
69 |             "timestamp": latest_entry.get("timestamp", ""),
70 |             "messages": new_achievements
71 |         }
72 |         achievements["entries"].append(achievement_entry)
73 |         save_json_file(TOKEN_HOLDER_ACHIEVEMENTS_FILE, achievements)
74 | 
75 |     return new_achievements
76 | 
77 | if __name__ == "__main__":
78 |     check_token_holder_achievements()
79 | 


--------------------------------------------------------------------------------
/achievements/x_follower_achievements.py:
--------------------------------------------------------------------------------
 1 | import os
 2 | import json
 3 | from datetime import datetime, timezone
 4 | 
 5 | X_FOLLOWER_METRICS_FILE = "data/metrics/daily/x_follower_metrics.json"
 6 | X_FOLLOWER_ACHIEVEMENTS_FILE = "data/achievements/x_follower_achievements.json"
 7 | 
 8 | def load_json_file(filepath):
 9 |     if not os.path.exists(filepath):
10 |         return {}
11 |     try:
12 |         with open(filepath, "r", encoding="utf-8") as f:
13 |             data = json.load(f)
14 |             return data
15 |     except json.JSONDecodeError as e:
16 |         return {}
17 | 
18 | def save_json_file(filepath, data):
19 |     os.makedirs(os.path.dirname(filepath), exist_ok=True)
20 |     with open(filepath, "w", encoding="utf-8") as f:
21 |         json.dump(data, f, indent=2)
22 | 
23 | def get_latest_metrics_entry(metrics):
24 |     if not metrics.get("entries"):
25 |         return None
26 |     latest = sorted(metrics["entries"], key=lambda e: e["timestamp"], reverse=True)[0]
27 |     return latest
28 | 
29 | def check_follower_count_milestones(latest_entry, achievements):
30 |     milestones = []
31 |     follower_milestone_step = 1000  # milestone every 1000 followers
32 | 
33 |     last_follower_milestone = achievements.get("last_follower_milestone", 0)
34 |     follower_count = latest_entry.get("followers", 0)
35 | 
36 |     current_milestone = (follower_count // follower_milestone_step) * follower_milestone_step
37 | 
38 |     if current_milestone > last_follower_milestone:
39 |         milestones.append(f"🎉 X Follower milestone reached: {current_milestone} followers!")
40 |         achievements["last_follower_milestone"] = current_milestone
41 | 
42 |     return milestones, achievements
43 | 
44 | def check_x_follower_achievements():
45 |     metrics = load_json_file(X_FOLLOWER_METRICS_FILE)
46 |     achievements = load_json_file(X_FOLLOWER_ACHIEVEMENTS_FILE)
47 | 
48 |     if not achievements:
49 |         achievements = {
50 |             "dataset_name": "x_follower_achievements",
51 |             "created_at": datetime.now(timezone.utc).isoformat(),
52 |             "entries": [],
53 |             "last_follower_milestone": 0
54 |         }
55 | 
56 |     latest_entry = get_latest_metrics_entry(metrics)
57 |     if not latest_entry:
58 |         return []
59 | 
60 |     new_achievements = []
61 | 
62 |     milestone_msgs, achievements = check_follower_count_milestones(latest_entry, achievements)
63 |     new_achievements.extend(milestone_msgs)
64 | 
65 |     if new_achievements:
66 |         achievement_entry = {
67 |             "id": latest_entry.get("id", ""),
68 |             "timestamp": latest_entry.get("timestamp", ""),
69 |             "messages": new_achievements
70 |         }
71 |         achievements["entries"].append(achievement_entry)
72 |         save_json_file(X_FOLLOWER_ACHIEVEMENTS_FILE, achievements)
73 | 
74 |     return new_achievements
75 | 
76 | if __name__ == "__main__":
77 |     check_x_follower_achievements()
78 | 


--------------------------------------------------------------------------------
/api/followers.py:
--------------------------------------------------------------------------------
 1 | import os
 2 | import json
 3 | import uuid
 4 | from datetime import datetime
 5 | import asyncio
 6 | from playwright.async_api import async_playwright
 7 | 
 8 | X_METRICS_FILE = "data/metrics/daily/x_follower_metrics.json"
 9 | X_PROFILE_URL = "https://x.com/arcdotfun"
10 | 
11 | async def scrape_x_profile(url: str) -> dict:
12 |     xhr_calls = []
13 | 
14 |     def intercept_response(response):
15 |         if response.request.resource_type == "xhr":
16 |             xhr_calls.append(response)
17 |         return response
18 | 
19 |     async with async_playwright() as pw:
20 |         browser = await pw.chromium.launch(headless=True)
21 |         context = await browser.new_context(
22 |             viewport={"width": 1920, "height": 1080},
23 |             user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
24 |         )
25 |         page = await context.new_page()
26 | 
27 |         page.on("response", intercept_response)
28 |         await page.goto(url)
29 |         await page.wait_for_selector("[data-testid='primaryColumn']")
30 |         await page.wait_for_timeout(3000)
31 | 
32 |         user_calls = [r for r in xhr_calls if "UserBy" in r.url]
33 |         for xhr in user_calls:
34 |             data = await xhr.json()
35 |             return data.get('data', {}).get('user', {}).get('result', None)
36 | 
37 |     return None
38 | 
39 | def save_followers_count(count):
40 |     os.makedirs("data", exist_ok=True)
41 |     now_iso = datetime.utcnow().isoformat() + "Z"
42 |     new_entry = {
43 |         "id": str(uuid.uuid4()),
44 |         "timestamp": now_iso,
45 |         "followers": count
46 |     }
47 | 
48 |     if os.path.exists(X_METRICS_FILE):
49 |         with open(X_METRICS_FILE, "r") as f:
50 |             try:
51 |                 data = json.load(f)
52 |                 if "entries" not in data:
53 |                     data["entries"] = []
54 |             except json.JSONDecodeError:
55 |                 data = {
56 |                     "dataset_name": "x_follower_metrics",
57 |                     "created_at": now_iso,
58 |                     "entries": []
59 |                 }
60 |     else:
61 |         data = {
62 |             "dataset_name": "x_follower_metrics",
63 |             "created_at": now_iso,
64 |             "entries": []
65 |         }
66 | 
67 |     data["entries"].append(new_entry)
68 | 
69 |     with open(X_METRICS_FILE, "w") as f:
70 |         json.dump(data, f, indent=2)
71 | 
72 | async def get_x_followers_stats():
73 |     profile = await scrape_x_profile(X_PROFILE_URL)
74 | 
75 |     if profile and 'legacy' in profile and 'followers_count' in profile['legacy']:
76 |         current_count = profile['legacy']['followers_count']
77 |     else:
78 |         current_count = 0
79 | 
80 |     save_followers_count(current_count)
81 |     formatted_count = f"{current_count:,}"
82 |     message = f"🐦 X Followers  >>  {formatted_count}"
83 | 
84 |     return {
85 |         "id": str(uuid.uuid4()),
86 |         "service": "x_followers",
87 |         "data": {
88 |             "followers": current_count,
89 |             "message": message,
90 |         }
91 |     }
92 | 
93 | def fetch_x_followers():
94 |     return asyncio.get_event_loop().run_until_complete(get_x_followers_stats())
95 | 
96 | if __name__ == "__main__":
97 |     result = fetch_x_followers()
98 |     print(result["data"]["message"])
99 | 


--------------------------------------------------------------------------------
/api/github.py:
--------------------------------------------------------------------------------
 1 | import os
 2 | import json
 3 | import requests
 4 | import uuid
 5 | from datetime import datetime, timezone
 6 | from dotenv import load_dotenv
 7 | 
 8 | load_dotenv()
 9 | 
10 | GITHUB_METRICS_FILE = "data/metrics/daily/github_metrics.json"
11 | 
12 | def get_github_stats():
13 |     """Fetches GitHub repository statistics and appends to metrics file."""
14 |     repo = os.getenv("REPO")
15 |     if not repo:
16 |         return "❌ REPO not set in environment."
17 | 
18 |     # Fetch general repo info
19 |     url = f"https://api.github.com/repos/{repo}"
20 |     response = requests.get(url)
21 |     if response.status_code != 200:
22 |         return "❌ Error fetching GitHub stats."
23 | 
24 |     data = response.json()
25 |     stars = data.get("stargazers_count", 0)
26 |     forks = data.get("forks_count", 0)
27 | 
28 |     # Fetch releases and filter for rig-core
29 |     releases_url = f"https://api.github.com/repos/{repo}/releases"
30 |     releases_response = requests.get(releases_url)
31 |     if releases_response.status_code != 200:
32 |         return "❌ Error fetching releases."
33 | 
34 |     releases = releases_response.json()
35 |     rig_core_versions = [
36 |         release.get("tag_name", "N/A")
37 |         for release in releases
38 |         if "rig-core" in release.get("tag_name", "")
39 |     ]
40 | 
41 |     if not rig_core_versions:
42 |         release_version = "N/A"
43 |     else:
44 |         rig_core_versions.sort(reverse=True)
45 |         release_version = rig_core_versions[0]
46 | 
47 |     # Build metrics entry
48 |     timestamp = datetime.now(timezone.utc).isoformat()
49 |     entry = {
50 |         "id": str(uuid.uuid4()),
51 |         "timestamp": timestamp,
52 |         "stars": stars,
53 |         "forks": forks,
54 |         "release_version": release_version
55 |     }
56 | 
57 |     save_github_metrics(entry)
58 | 
59 |     return (
60 |         f"⭐️ Github Stars  >>  {stars:,}\n"
61 |         f"🍴 Github Forks  >>  {forks:,}\n"
62 |         f"🔖 Rig Version   >>  {release_version}"
63 |     )
64 | 
65 | def save_github_metrics(new_entry):
66 |     """Appends the new GitHub stats entry to the metrics file."""
67 |     if os.path.exists(GITHUB_METRICS_FILE):
68 |         with open(GITHUB_METRICS_FILE, "r") as f:
69 |             try:
70 |                 existing_data = json.load(f)
71 |             except json.JSONDecodeError:
72 |                 existing_data = {}
73 |     else:
74 |         existing_data = {}
75 | 
76 |     if not existing_data:
77 |         existing_data = {
78 |             "dataset_name": "github_metrics",
79 |             "created_at": datetime.now(timezone.utc).isoformat(),
80 |             "entries": []
81 |         }
82 | 
83 |     existing_data["entries"].append(new_entry)
84 | 
85 |     with open(GITHUB_METRICS_FILE, "w") as f:
86 |         json.dump(existing_data, f, indent=2)


--------------------------------------------------------------------------------
/api/holders.py:
--------------------------------------------------------------------------------
  1 | import os
  2 | import json
  3 | import uuid
  4 | import requests
  5 | from datetime import datetime, timezone
  6 | from dotenv import load_dotenv
  7 | 
  8 | load_dotenv()
  9 | 
 10 | TOKEN_MINT_ADDRESS = os.getenv("TOKEN_ADDRESS")
 11 | HELIUS_API_KEY = os.getenv("HELIUS_API_KEY")
 12 | 
 13 | DATA_FILE = "data/metrics/daily/token_holder_metrics.json"
 14 | 
 15 | def load_data():
 16 |     if os.path.exists(DATA_FILE):
 17 |         try:
 18 |             with open(DATA_FILE, "r") as f:
 19 |                 data = json.load(f)
 20 |                 if "entries" not in data:
 21 |                     data = {
 22 |                         "dataset_name": "token_holder_metrics",
 23 |                         "created_at": datetime.now(timezone.utc).isoformat(),
 24 |                         "entries": []
 25 |                     }
 26 |                 return data
 27 |         except json.JSONDecodeError:
 28 |             pass
 29 |     return {
 30 |         "dataset_name": "token_holder_metrics",
 31 |         "created_at": datetime.now(timezone.utc).isoformat(),
 32 |         "entries": []
 33 |     }
 34 | 
 35 | def save_data(data):
 36 |     data["created_at"] = datetime.now(timezone.utc).isoformat()
 37 |     os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
 38 |     with open(DATA_FILE, "w") as f:
 39 |         json.dump(data, f, indent=2)
 40 | 
 41 | import time
 42 | 
 43 | def fetch_token_holders(max_retries=5, backoff_factor=2):
 44 |     url = f"https://mainnet.helius-rpc.com/?api-key={HELIUS_API_KEY}"
 45 | 
 46 |     payload = {
 47 |         "jsonrpc": "2.0",
 48 |         "id": "get-holders",
 49 |         "method": "getTokenAccounts",
 50 |         "params": {
 51 |             "mint": TOKEN_MINT_ADDRESS,
 52 |             "limit": 1000,
 53 |             "options": {
 54 |                 "showZeroBalance": False
 55 |             }
 56 |         }
 57 |     }
 58 | 
 59 |     headers = {"Content-Type": "application/json"}
 60 | 
 61 |     unique_holders = set()
 62 |     has_more = True
 63 |     cursor = None
 64 |     retries = 0
 65 | 
 66 |     while has_more:
 67 |         if cursor:
 68 |             payload["params"]["cursor"] = cursor
 69 |         else:
 70 |             payload["params"].pop("cursor", None)
 71 | 
 72 |         response = requests.post(url, headers=headers, json=payload)
 73 | 
 74 |         if response.status_code == 200:
 75 |             data = response.json()
 76 | 
 77 |             if "error" in data:
 78 |                 print(f"API Error: {data['error']['message']}")
 79 |                 return 0
 80 | 
 81 |             result = data.get("result", {})
 82 |             accounts = result.get("token_accounts", [])
 83 | 
 84 |             for account in accounts:
 85 |                 owner = account.get("owner")
 86 |                 if owner:
 87 |                     unique_holders.add(owner)
 88 | 
 89 |             cursor = result.get("cursor")
 90 |             has_more = bool(cursor)
 91 | 
 92 |             retries = 0  # reset retries on successful response
 93 | 
 94 |         elif response.status_code == 429:
 95 |             retries += 1
 96 |             if retries > max_retries:
 97 |                 print("Max retries reached due to rate limiting. Aborting.")
 98 |                 return len(unique_holders)
 99 |             wait_time = backoff_factor ** retries
100 |             print(f"Rate limited (429). Waiting {wait_time} seconds before retry {retries}...")
101 |             time.sleep(wait_time)
102 | 
103 |         else:
104 |             print(f"Error fetching data: HTTP {response.status_code}")
105 |             has_more = False
106 | 
107 |     return len(unique_holders)
108 | 
109 | def log_holder_count(count):
110 |     data = load_data()
111 |     new_entry = {
112 |         "id": str(uuid.uuid4()),
113 |         "timestamp": datetime.now(timezone.utc).isoformat(),
114 |         "holder_count": count
115 |     }
116 |     data["entries"].append(new_entry)
117 |     save_data(data)
118 | 
119 | def get_token_stats():
120 |     count = fetch_token_holders()
121 |     log_holder_count(count)
122 |     formatted_count = "{:,}".format(count)
123 |     return f"💊 $ARC Holders  >>  {formatted_count}"
124 | 


--------------------------------------------------------------------------------
/api/posts.py:
--------------------------------------------------------------------------------
  1 | import asyncio
  2 | import json
  3 | import sys
  4 | from pathlib import Path
  5 | from datetime import datetime
  6 | from playwright.async_api import async_playwright
  7 | from urllib.parse import urlparse
  8 | 
  9 | X_PROFILES = [
 10 |     "https://x.com/arcdotfun",
 11 |     "https://x.com/0thTachi",
 12 |     "https://x.com/Kezo_Futura"
 13 | ]
 14 | 
 15 | def format_timestamp(iso_ts):
 16 |     try:
 17 |         dt = datetime.fromisoformat(iso_ts.replace("Z", "+00:00"))
 18 |         return dt.strftime("%m/%d/%Y %I:%M %p")
 19 |     except Exception:
 20 |         return "Unknown time"
 21 | 
 22 | def extract_username(url):
 23 |     parsed = urlparse(url)
 24 |     return parsed.path.strip("/").split("/")[0]
 25 | 
 26 | async def get_latest_posts_from_profile(url, max_scrolls=10):
 27 |     try:
 28 |         async with async_playwright() as p:
 29 |             browser = await p.chromium.launch(headless=True)
 30 |             context = await browser.new_context()
 31 |             page = await context.new_page()
 32 | 
 33 |             await page.goto(url)
 34 |             await page.wait_for_selector("[data-testid='cellInnerDiv']")
 35 | 
 36 |             seen_urls = set()
 37 |             results = []
 38 | 
 39 |             for _ in range(max_scrolls):
 40 |                 posts = await page.query_selector_all("[data-testid='cellInnerDiv']")
 41 |                 for post in posts:
 42 |                     time_element = await post.query_selector("time")
 43 |                     timestamp = await time_element.get_attribute("datetime") if time_element else None
 44 |                     if not timestamp:
 45 |                         continue
 46 | 
 47 |                     link_element = await post.query_selector("a[href*='/status/']")
 48 |                     relative_link = await link_element.get_attribute("href") if link_element else None
 49 |                     if not relative_link:
 50 |                         continue
 51 | 
 52 |                     full_link = f"https://x.com{relative_link}"
 53 |                     if full_link in seen_urls:
 54 |                         continue
 55 |                     seen_urls.add(full_link)
 56 | 
 57 |                     results.append({
 58 |                         "username": extract_username(url),
 59 |                         "url": full_link,
 60 |                         "timestamp": timestamp
 61 |                     })
 62 | 
 63 |                 # Scroll to bottom and wait for new content
 64 |                 await page.evaluate("window.scrollBy(0, document.body.scrollHeight)")
 65 |                 await page.wait_for_timeout(1500)
 66 | 
 67 |             await browser.close()
 68 | 
 69 |             # Sort by timestamp descending
 70 |             sorted_results = sorted(results, key=lambda x: x["timestamp"], reverse=True)
 71 |             return sorted_results
 72 | 
 73 |     except Exception as e:
 74 |         print(f"Error fetching posts from {url}: {e}")
 75 |         return []
 76 | 
 77 | async def get_all_latest_posts():
 78 |     all_results = []
 79 |     for profile in X_PROFILES:
 80 |         posts = await get_latest_posts_from_profile(profile)
 81 |         all_results.extend(posts)
 82 |     return all_results
 83 | 
 84 | async def build_latest_posts_message():
 85 |     posts = await get_all_latest_posts()
 86 |     if not posts:
 87 |         return "⚠️ No posts found."
 88 | 
 89 |     message_lines = ["🧵 **Latest Posts:**"]
 90 |     for post in posts:
 91 |         formatted_time = format_timestamp(post['timestamp'])
 92 |         username = post['username']
 93 |         preview = (
 94 |             f"**{username}**  \n"
 95 |             f"🕒 {formatted_time}  \n"
 96 |             f"[View Post]({post['url']})"
 97 |         )
 98 |         message_lines.append(preview)
 99 | 
100 |     return "\n\n---\n\n".join(message_lines)
101 | 
102 | async def main():
103 |     message = await build_latest_posts_message()
104 |     data = {
105 |         "latest_posts_message": message
106 |     }
107 |     try:
108 |         path = Path("filters/posts.json")
109 |         path.parent.mkdir(parents=True, exist_ok=True)
110 |         with open(path, "w", encoding="utf-8") as f:
111 |             json.dump(data, f, ensure_ascii=False, indent=2)
112 |         print("Successfully updated filters/posts.json")
113 |     except Exception as e:
114 |         print(f"Error writing posts.json: {e}")
115 | 
116 | # ✅ Local test helper:
117 | async def test_profile(profile_url):
118 |     print(f"\n🔍 Testing profile: {profile_url}")
119 |     posts = await get_latest_posts_from_profile(profile_url, count=3)
120 |     for i, post in enumerate(posts, 1):
121 |         print(f"\nPost {i}:")
122 |         print(f"Username: {post['username']}")
123 |         print(f"Time: {format_timestamp(post['timestamp'])}")
124 |         print(f"URL: {post['url']}")
125 | 
126 | if __name__ == "__main__":
127 |     if len(sys.argv) > 1 and sys.argv[1] == "test":
128 |         # Example usage: python script.py test https://x.com/arcdotfun
129 |         test_url = sys.argv[2] if len(sys.argv) > 2 else X_PROFILES[0]
130 |         asyncio.run(test_profile(test_url))
131 |     else:
132 |         asyncio.run(main())
133 | 


--------------------------------------------------------------------------------
/api/telegram.py:
--------------------------------------------------------------------------------
 1 | import os
 2 | import json
 3 | import uuid
 4 | from datetime import datetime, timezone
 5 | from dotenv import load_dotenv
 6 | from telegram import Bot
 7 | 
 8 | load_dotenv()
 9 | 
10 | TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
11 | GROUP_CHAT_ID = os.getenv("GROUP_CHAT_ID")
12 | 
13 | bot = Bot(token=TELEGRAM_BOT_TOKEN)
14 | DATA_FILE = "data/metrics/daily/telegram_metrics.json"
15 | 
16 | def load_data():
17 |     """Load the full dataset, return dict with dataset_name, created_at, entries"""
18 |     if os.path.exists(DATA_FILE):
19 |         with open(DATA_FILE, "r") as f:
20 |             try:
21 |                 data = json.load(f)
22 |                 # Ensure keys exist for backward compatibility
23 |                 if "entries" not in data:
24 |                     data = {
25 |                         "dataset_name": "telegram_metrics",
26 |                         "created_at": datetime.now(timezone.utc).isoformat(),
27 |                         "entries": []
28 |                     }
29 |                 return data
30 |             except json.JSONDecodeError:
31 |                 pass
32 |     # Return default structure if no file or error
33 |     return {
34 |         "dataset_name": "telegram_metrics",
35 |         "created_at": datetime.now(timezone.utc).isoformat(),
36 |         "entries": []
37 |     }
38 | 
39 | def save_data(data):
40 |     """Save the full dataset, update created_at timestamp"""
41 |     data["created_at"] = datetime.now(timezone.utc).isoformat()
42 |     os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
43 |     with open(DATA_FILE, "w") as f:
44 |         json.dump(data, f, indent=2)
45 | 
46 | 
47 | def log_member_count(count):
48 |     """Append a new member count entry with id and timestamp"""
49 |     data = load_data()
50 |     new_entry = {
51 |         "id": str(uuid.uuid4()),
52 |         "timestamp": datetime.now(timezone.utc).isoformat(),
53 |         "member_count": count
54 |     }
55 |     data["entries"].append(new_entry)
56 |     save_data(data)
57 |     return new_entry
58 | 
59 | def get_latest_member_count():
60 |     """Return the last recorded member count, or 0 if none."""
61 |     data = load_data()
62 |     if data["entries"]:
63 |         return data["entries"][-1]["member_count"]
64 |     return 0
65 | 
66 | def get_telegram_stats():
67 |     """Fetch current member count, log it, and return formatted message."""
68 |     try:
69 |         current_count = bot.get_chat_member_count(GROUP_CHAT_ID)
70 |         log_member_count(current_count)
71 |         formatted_count = "{:,}".format(current_count)
72 |         return f"👥 Telegram Members  >>  {formatted_count}"
73 |     except Exception as e:
74 |         print(f"Error fetching Telegram stats: {e}")
75 |         return "❌ Error fetching Telegram member count."
76 | 


--------------------------------------------------------------------------------
/blocklists/ban_phrases.txt:
--------------------------------------------------------------------------------
/blocklists/delete_phrases.txt:
--------------------------------------------------------------------------------
/blocklists/mute_phrases.txt:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/blocklists/mute_phrases.txt


--------------------------------------------------------------------------------
/bot.py:
--------------------------------------------------------------------------------
  1 | import os
  2 | import re
  3 | import json
  4 | from dotenv import load_dotenv
  5 | from telegram import Update, ChatPermissions, ParseMode
  6 | from telegram.ext import Updater, MessageHandler, Filters, CallbackContext, CommandHandler, Filters
  7 | from collections import defaultdict, deque
  8 | from datetime import datetime, timedelta, timezone, time
  9 | from combot.scheduled_warnings import messages
 10 | from combot.brand_assets import messages as brand_assets_messages
 11 | 
 12 | load_dotenv()  # Load .env vars
 13 | 
 14 | # Get bot token from environment
 15 | BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
 16 | GROUP_CHAT_ID = os.getenv('GROUP_CHAT_ID')
 17 | 
 18 | # File path for filters
 19 | FILTERS_FILE = "filters/filters.json"
 20 | 
 21 | # File path for metrics
 22 | METRICS_FILE = "filters/metrics.json"
 23 | 
 24 | # File path for accompanying filter media
 25 | MEDIA_FOLDER = "media"
 26 | 
 27 | # File paths for phrases
 28 | BAN_PHRASES_FILE = "blocklists/ban_phrases.txt"
 29 | MUTE_PHRASES_FILE = "blocklists/mute_phrases.txt"
 30 | DELETE_PHRASES_FILE = "blocklists/delete_phrases.txt"
 31 | WHITELIST_PHRASES_FILE = "whitelists/whitelist_phrases.txt"
 32 | 
 33 | # Suspicious names to auto-ban
 34 | SUSPICIOUS_USERNAMES = [
 35 |     "dev", "developer", "admin", "mod", "owner", "arc", "arc_agent", "arc agent", "arch_agent", "arch agent", "support", "helpdesk", "administrator", "arc admin", "arc_admin"
 36 | ]
 37 | 
 38 | BIO_PHRASES = [
 39 |     "verify in bio", "link in bio", "read bio", "look at bio", "info in bio"
 40 | ]
 41 | 
 42 | # Mute duration in seconds (3 days)
 43 | MUTE_DURATION = 3 * 24 * 60 * 60
 44 | 
 45 | # auto spam detection variables
 46 | SPAM_THRESHOLD = 3
 47 | TIME_WINDOW = timedelta(seconds=15)
 48 | SPAM_TRACKER = defaultdict(lambda: deque(maxlen=SPAM_THRESHOLD))
 49 | SPAM_RECORDS = {} # stores flagged spam messages for 5 minutes
 50 | SPAM_RECORD_DURATION = timedelta(minutes=5)
 51 | 
 52 | def get_admin_ids(context, chat_id):
 53 |     # Fetch chat admins dynamically
 54 |     chat_admins = context.bot.get_chat_administrators(chat_id)
 55 |     return [admin.user.id for admin in chat_admins]
 56 | 
 57 | # combot security message
 58 | def post_security_message(context: CallbackContext, index: int):
 59 |     try:
 60 |         chat = context.bot.get_chat(GROUP_CHAT_ID)
 61 |         pinned = chat.pinned_message
 62 |         if pinned:
 63 |             try:
 64 |                 context.bot.unpin_chat_message(chat_id=GROUP_CHAT_ID, message_id=pinned.message_id)
 65 |             except Exception as e:
 66 |                 print(f"[Security] Failed to unpin message: {e}")
 67 |             try:
 68 |                 context.bot.delete_message(chat_id=GROUP_CHAT_ID, message_id=pinned.message_id)
 69 |             except Exception as e:
 70 |                 print(f"[Security] Failed to delete message: {e}")
 71 |     except Exception as e:
 72 |         print(f"[Security] Failed to retrieve chat or pinned message: {e}")
 73 |     try:
 74 |         message = messages[index]
 75 |         sent_message = context.bot.send_message(
 76 |             chat_id=GROUP_CHAT_ID, 
 77 |             text=message, 
 78 |             parse_mode=ParseMode.HTML
 79 |         )
 80 |         context.bot.pin_chat_message(
 81 |             chat_id=GROUP_CHAT_ID, 
 82 |             message_id=sent_message.message_id, 
 83 |             disable_notification=True
 84 |         )
 85 |     except Exception as e:
 86 |         print(f"[Security] Failed to pin message: {e}")
 87 | 
 88 | # combot brand assets
 89 | def post_brand_assets(context: CallbackContext, index: int = 0):
 90 |     try:
 91 |         chat = context.bot.get_chat(GROUP_CHAT_ID)
 92 |         pinned = chat.pinned_message
 93 |         if pinned:
 94 |             try:
 95 |                 context.bot.unpin_chat_message(chat_id=GROUP_CHAT_ID, message_id=pinned.message_id)
 96 |             except Exception as e:
 97 |                 print(f"[Brand Assets] Failed to unpin message: {e}")
 98 |             try:
 99 |                 context.bot.delete_message(chat_id=GROUP_CHAT_ID, message_id=pinned.message_id)
100 |             except Exception as e:
101 |                 print(f"[Brand Assets] Failed to delete message: {e}")
102 |     except Exception as e:
103 |         print(f"[Brand Assets] Failed to retrieve chat or pinned message: {e}")
104 |     try:
105 |         message = brand_assets_messages[index]
106 |         sent_message = context.bot.send_message(
107 |             chat_id=GROUP_CHAT_ID,
108 |             text=message,
109 |             parse_mode=ParseMode.HTML
110 |         )
111 |         context.bot.pin_chat_message(
112 |             chat_id=GROUP_CHAT_ID,
113 |             message_id=sent_message.message_id,
114 |             disable_notification=True
115 |         )
116 |     except Exception as e:
117 |         print(f"[Brand Assets] Failed to send or pin message: {e}")
118 | 
119 | # Load filters as dict
120 | def load_filters(file_path):
121 |     with open(file_path, 'r', encoding='utf-8') as file:
122 |         return json.load(file)
123 | 
124 | FILTERS = load_filters(FILTERS_FILE)
125 | 
126 | # Load metrics 
127 | def load_metrics(file_path):
128 |     with open(file_path, 'r', encoding='utf-8') as file:
129 |         return json.load(file)
130 | 
131 | METRICS = load_metrics(METRICS_FILE)
132 | 
133 | # Load blocklist/whitelisted words/phrases from files
134 | def load_phrases(file_path):
135 |     with open(file_path, 'r', encoding='utf-8') as file:
136 |         return [line.strip().lower() for line in file.readlines()]
137 | 
138 | BAN_PHRASES = load_phrases(BAN_PHRASES_FILE)
139 | MUTE_PHRASES = load_phrases(MUTE_PHRASES_FILE)
140 | DELETE_PHRASES = load_phrases(DELETE_PHRASES_FILE)
141 | WHITELIST_PHRASES = load_phrases(WHITELIST_PHRASES_FILE)
142 | 
143 | def contains_multiplication_phrase(text):
144 |     text = text.lower()
145 |     # Match digit(s) possibly separated by spaces, next to an 'x'
146 |     pattern = r"(?:\d\s*)+x|x\s*(?:\d\s*)+"
147 |     return re.search(pattern, text)
148 | 
149 | def contains_give_sol_phrase(text):
150 |     text = text.lower()
151 |     # Match 'give' followed by a number and then 'sol' or 'solana'
152 |     pattern = r"give\s*(\d+)\s*(sol|solana)"
153 |     return re.search(pattern, text)
154 | 
155 | # check for spam
156 | def check_for_spam(message_text, user_id):
157 |     now = datetime.now(timezone.utc)
158 |     # track user and timestamp of the message
159 |     print(f"Checking for spam: {message_text} from user: {user_id}")
160 |     SPAM_TRACKER[message_text].append((user_id, now))
161 | 
162 |     # Filter out old messages that are outside of the time window
163 |     recent = [entry for entry in SPAM_TRACKER[message_text] if now - entry[1] <= TIME_WINDOW]
164 |     SPAM_TRACKER[message_text] = deque(recent)
165 | 
166 |     print(f"Recent messages for '{message_text}': {recent}")
167 | 
168 |     # If recent messages exceed the threshold, flag as spam
169 |     if len(recent) >= SPAM_THRESHOLD:
170 |         print(f"Spam detected for message: '{message_text}'")
171 |         # flag message as spam and store for 5 minutes in memory
172 |         SPAM_RECORDS[message_text] = now # only store message and timestamp
173 |         spammer_ids = list(set([entry[0] for entry in recent])) # Return list of user_ids to mute
174 |         print(f"Flagging {len(spammer_ids)} users for spam: {spammer_ids}") 
175 |         return spammer_ids
176 |     
177 |     elif recent and len(recent) < SPAM_THRESHOLD and (now - recent[0][1] > TIME_WINDOW):
178 |         # Not spam, expired window – clean it up
179 |         SPAM_TRACKER.pop(message_text, None)
180 | 
181 |     return []
182 | 
183 | # check for recent spam and mute spammers
184 | def check_recent_spam(message_text):
185 |     now = datetime.now(timezone.utc)
186 |     timestamp = SPAM_RECORDS.get(message_text)
187 |     if timestamp:
188 |         print(f"Message '{message_text}' is flagged as spam, timestamp: {timestamp}")
189 |     return timestamp and (now - timestamp <= SPAM_RECORD_DURATION)
190 | 
191 | # clean up spam records
192 | def cleanup_spam_records(context: CallbackContext):
193 |     now = datetime.now(timezone.utc)
194 |     expired_messages = []
195 | 
196 |     for message_text, timestamp in list(SPAM_RECORDS.items()):
197 |         if now - timestamp > SPAM_RECORD_DURATION:
198 |             expired_messages.append(message_text)
199 |             del SPAM_RECORDS[message_text]
200 |             print(f"[CLEANUP] Removed expired spam record: '{message_text}'")
201 | 
202 |     if not expired_messages:
203 |         print("[CLEANUP] No expired spam messages to remove.")
204 | 
205 | def contains_non_x_links(text: str) -> bool:
206 |     # Matches all URLs
207 |     url_pattern = r'(https?://[^\s]+)'
208 |     urls = re.findall(url_pattern, text)
209 | 
210 |     for url in urls:
211 |         # Allow only Twitter/X links
212 |         if not re.search(r'https?://(www\.)?(x\.com|twitter\.com)/[^\s]+', url):
213 |             return True  # Found a non-X link
214 |     return False
215 | 
216 | # Suspicious auto-ban function
217 | def handle_new_members(update, context):
218 |     message = update.message
219 |     if message is None or not message.new_chat_members:
220 |         return
221 | 
222 |     chat_id = message.chat.id
223 | 
224 |     for new_user in message.new_chat_members:
225 |         name = new_user.full_name or "No Name"
226 |         username = new_user.username or "No Username"
227 |         user_id = new_user.id
228 | 
229 |         name_info = f"Name: {name}, Username: @{username}" if new_user.username else f"Name: {name} (no username)"
230 |         print(f"[JOIN] {name_info} (ID: {user_id})")
231 | 
232 |         name_lower = name.lower()
233 |         username_lower = username.lower()
234 | 
235 |         # Check for suspicious keywords in name
236 |         if any(keyword in name_lower or keyword in username_lower for keyword in SUSPICIOUS_USERNAMES):
237 |             try:
238 |                 context.bot.ban_chat_member(chat_id, user_id)
239 |                 print(f"[BANNED] Suspicious user auto-banned: {name_info}")
240 |                 continue
241 |             except Exception as e:
242 |                 print(f"[ERROR] Failed to ban {user_id}: {e}")
243 | 
244 |         # Check for bio phrases in name
245 |         if any(keyword in name_lower or keyword in username_lower for keyword in BIO_PHRASES):
246 |             try:
247 |                 context.bot.ban_chat_member(chat_id, user_id)
248 |                 print(f"[BANNED] User with suspicious name (bio phrase): {name_info}")
249 |             except Exception as e:
250 |                 print(f"[ERROR] Failed to ban user with bio phrase in name {user_id}: {e}")
251 | 
252 | def list_filters(update: Update, context: CallbackContext):
253 |     # Load the latest filters
254 |     with open(FILTERS_FILE, 'r', encoding='utf-8') as f:
255 |         filters = json.load(f)
256 | 
257 |     # Get and sort all triggers alphabetically (removing leading slash only for sorting)
258 |     sorted_triggers = sorted(filters.keys(), key=lambda k: k.lstrip('/').lower())
259 | 
260 |     # Re-apply slash only if the original trigger had it
261 |     formatted_triggers = [f"`{trigger}`" for trigger in sorted_triggers]
262 | 
263 |     # Telegram messages max out at 4096 characters
264 |     response = "*Available Filters:*\n" + "\n".join(formatted_triggers)
265 |     if len(response) > 4000:
266 |         for i in range(0, len(formatted_triggers), 80):  # 80 items per message chunk
267 |             chunk = "*Available Filters:*\n" + "\n".join(formatted_triggers[i:i+80])
268 |             update.message.reply_text(chunk, parse_mode="Markdown")
269 |     else:
270 |         update.message.reply_text(response, parse_mode="Markdown")
271 | 
272 | def check_message(update: Update, context: CallbackContext):
273 |     print(f"[GROUP MESSAGE] {update.message.text}")
274 |     should_skip_spam_check = False
275 |     
276 |     message = update.message or update.channel_post  # Handle both messages and channel posts
277 |     if not message:
278 |         print("==== No message or channel post detected ====")
279 |         return
280 |     
281 |     message_text = message.text.lower()
282 |     chat_id = update.effective_chat.id
283 |     user_id = update.effective_user.id
284 |     user = update.effective_user
285 | 
286 |     # Fetch chat admins to prevent acting on their messages
287 |     chat_admins = context.bot.get_chat_administrators(chat_id)
288 |     admin_ids = [admin.user.id for admin in chat_admins]
289 |     
290 |     # Ignore messages from admins
291 |     if user_id not in admin_ids:
292 | 
293 |         # check if message is too short
294 |         if len(message_text.strip()) < 2:
295 |             context.bot.delete_message(chat_id=chat_id, message_id=message.message_id)
296 |             return
297 | 
298 |         # Auto-ban based on suspicious name or username
299 |         name_username = f"{user.full_name} {user.username or ''}".lower()
300 |         if any(keyword in name_username for keyword in SUSPICIOUS_USERNAMES):
301 |             context.bot.ban_chat_member(chat_id=chat_id, user_id=user_id)
302 |             return
303 |         
304 |         # Auto-ban based on bio-like phrases in name/username
305 |         if any(keyword in name_username for keyword in BIO_PHRASES):
306 |             context.bot.ban_chat_member(chat_id=chat_id, user_id=user_id)
307 |             print(f"[BANNED] Bio phrase detected in name: {name_username}")
308 |             return
309 |         
310 |         # Delete message if it contains non-X links
311 |         if contains_non_x_links(message.text):
312 |             print(f"[LINK FILTER] Message from user {user_id} contains non-X links. Deleting.")
313 |             context.bot.delete_message(chat_id=chat_id, message_id=message.message_id)
314 |             return
315 | 
316 |         # Check for multiplication spam
317 |         if contains_multiplication_phrase(message_text):
318 |             context.bot.delete_message(chat_id=chat_id, message_id=message.message_id)
319 |             return
320 |         
321 |         # Check for "give x sol" or "give x solana" spam
322 |         if contains_give_sol_phrase(message_text):
323 |             context.bot.delete_message(chat_id=chat_id, message_id=message.message_id)
324 |             return
325 |         
326 |         # Block forwarded messages from non-admins
327 |         if message.forward_date or message.forward_from or message.forward_from_chat:
328 |             print(f"[FORWARD DETECTED] User {user_id} forwarded a message.")
329 |             context.bot.delete_message(chat_id=chat_id, message_id=message.message_id)
330 |             return
331 |         
332 |         # 1. autospam - check if its a command or matches a filter
333 |         for trigger in FILTERS.keys():
334 |             normalized_trigger = trigger.strip().lower()
335 |             pattern = rf'(?<!\w)/?{re.escape(normalized_trigger)}(_\w+)?(?!\w)'
336 |             if re.search(pattern, message_text):
337 |                 should_skip_spam_check = True
338 |                 print(f"[SPAM CHECK SKIPPED] Message '{message_text}' matched FILTER trigger: '{trigger}'")
339 |                 break
340 | 
341 |         # 2. autospam - check whitelist
342 |         if not should_skip_spam_check:
343 |             if message_text.strip() in WHITELIST_PHRASES:
344 |                 print(f"[SPAM CHECK SKIPPED] Message '{message_text}' matched WHITELIST.")
345 |                 should_skip_spam_check = True
346 | 
347 |         # 3. autospam - check for spam
348 |         if not should_skip_spam_check:
349 |             # Run spam detection only if no FILTER trigger matched
350 |             spammer_ids = check_for_spam(message_text, user_id)
351 | 
352 |             if check_recent_spam(message_text) and user_id not in spammer_ids:
353 |                 spammer_ids.append(user_id)
354 | 
355 |             if spammer_ids:
356 |                 print(f"Muting spammers for message: '{message_text}'")
357 |                 for spammer_id in set(spammer_ids):
358 |                     try:
359 |                         until_date = message.date + timedelta(seconds=MUTE_DURATION)
360 |                         permissions = ChatPermissions(can_send_messages=False)
361 |                         context.bot.restrict_chat_member(chat_id=chat_id, user_id=spammer_id, permissions=permissions, until_date=until_date)
362 |                         print(f"Muted user {spammer_id} for spam message.")
363 |                     except Exception as e:
364 |                         print(f"Failed to mute spammer {spammer_id}: {e}")
365 |                 return
366 |     
367 |         # Check for banned phrases
368 |         for phrase in BAN_PHRASES:
369 |             # Use word boundaries to match exact words
370 |             if re.search(r'\b' + re.escape(phrase) + r'\b', message_text):
371 |                 print(f"[BAN MATCH] Phrase: '{phrase}' matched in message: '{message_text}'")
372 |                 context.bot.ban_chat_member(chat_id=chat_id, user_id=user.id)
373 |                 message.reply_text(f"arc angel fallen. {user.first_name} has been banned.")
374 |                 return
375 | 
376 |         # Check for muted phrases
377 |         for phrase in MUTE_PHRASES:
378 |             # Use word boundaries to match exact words
379 |             if re.search(r'\b' + re.escape(phrase) + r'\b', message_text):
380 |                 print(f"[MUTE MATCH] Phrase: '{phrase}' matched in message: '{message_text}'")
381 |                 until_date = message.date + timedelta(seconds=MUTE_DURATION)
382 |                 permissions = ChatPermissions(can_send_messages=False)
383 |                 context.bot.restrict_chat_member(chat_id=chat_id, user_id=user.id, permissions=permissions, until_date=until_date)
384 |                 message.reply_text(f"{user.first_name} has been muted for 3 days.")
385 |                 return
386 | 
387 |         # Check for deleted phrases
388 |         for phrase in DELETE_PHRASES:
389 |             # Use word boundaries to match exact words
390 |             if re.search(r'\b' + re.escape(phrase) + r'\b', message_text):
391 |                 print(f"[DELETE MATCH] Phrase: '{phrase}' matched in message: '{message_text}'")
392 |                 context.bot.delete_message(chat_id=chat_id, message_id=message.message_id)
393 |                 return
394 | 
395 |     # Filter Responses (apply to all)
396 |     for trigger, filter_data in FILTERS.items():
397 |         normalized_trigger = trigger.strip().lower()
398 |         # use word boundaries but allow underscores to be appended
399 |         pattern = rf'(?<!\w)/?{re.escape(normalized_trigger)}(_\w+)?(?!\w)'
400 |         
401 |         if re.search(pattern, message_text):
402 |             response_text = filter_data.get("response_text", "")
403 |             media_file = filter_data.get("media")
404 |             media_type = filter_data.get("type", "gif").lower()
405 | 
406 |             if media_file:
407 |                 media_path = os.path.join(MEDIA_FOLDER, media_file)
408 |                 if os.path.exists(media_path):
409 |                     with open(media_path, 'rb') as media:
410 |                         if media_type in ["gif", "animation"]:
411 |                             context.bot.send_animation(chat_id=chat_id, animation=media, caption=response_text or None)
412 |                         elif media_type == "image":
413 |                             context.bot.send_photo(chat_id=chat_id, photo=media, caption=response_text or None)
414 |                         elif media_type == "video":
415 |                             context.bot.send_video(chat_id=chat_id, video=media, caption=response_text or None)
416 |                 elif response_text:
417 |                     message.reply_text(response_text)
418 |             elif response_text:
419 |                 message.reply_text(response_text)
420 |             return  # Respond only once
421 |         
422 |     if re.search(r'(?<!\w)/metrics(?!\w)', message_text):
423 |         try:
424 |             with open("filters/metrics.json", "r", encoding="utf-8") as f:
425 |                 data = json.load(f)
426 |             response_text = data.get("last_metrics_message", "⚠️ Metrics message is missing or invalid.")
427 |             message.reply_text(response_text)
428 |         except Exception as e:
429 |             message.reply_text(f"⚠️ Error reading metrics: {e}")
430 |         return
431 |     
432 |     if re.search(r'(?<!\w)/growth(?!\w)', message_text):
433 |         try:
434 |             with open("filters/growth.json", "r", encoding="utf-8") as f:
435 |                 data = json.load(f)
436 |             response_text = data.get("last_weekly_metrics_message", "⚠️ Weekly metrics message is missing or invalid.")
437 |             message.reply_text(response_text)
438 |         except Exception as e:
439 |             message.reply_text(f"⚠️ Error reading weekly metrics: {e}")
440 |         return
441 |     
442 |     if re.search(r'(?<!\w)/posts(?!\w)', message_text):
443 |         try:
444 |             with open("filters/posts.json", "r", encoding="utf-8") as f:
445 |                 data = json.load(f)
446 |             response_text = data.get("latest_posts_message", "⚠️ Latest posts message is missing or invalid.")
447 |             message.reply_text(response_text, disable_web_page_preview=False, parse_mode="Markdown")
448 |         except Exception as e:
449 |             message.reply_text(f"⚠️ Error reading posts: {e}")
450 |         return
451 | 
452 | 
453 | 
454 | def main():
455 |     print("starting bot")
456 |     updater = Updater(BOT_TOKEN, use_context=True)
457 |     dp = updater.dispatcher
458 |     job_queue = updater.job_queue
459 | 
460 |     # Scheduled jobs
461 |     job_queue.run_daily(lambda context: post_security_message(context, 0), time=time(hour=8, minute=0))  
462 |     job_queue.run_daily(lambda context: post_security_message(context, 1), time=time(hour=16, minute=0))
463 |     job_queue.run_daily(post_brand_assets, time=time(hour=0, minute=0))
464 |     job_queue.run_repeating(cleanup_spam_records, interval=60, first=60)
465 | 
466 |     # Message and command handlers
467 |     dp.add_handler(CommandHandler("filters", list_filters))
468 |     dp.add_handler(MessageHandler(Filters.status_update.new_chat_members, handle_new_members))
469 |     dp.add_handler(MessageHandler(Filters.text | Filters.command, check_message))
470 | 
471 |     updater.start_polling()
472 |     updater.idle()
473 | 
474 | if __name__ == '__main__':
475 |     main()


--------------------------------------------------------------------------------
/combot/brand_assets.py:
--------------------------------------------------------------------------------
 1 | message_1 = """<b>arc_BRAND_ASSETS</b>
 2 | 
 3 | dear complex,
 4 | 
 5 | feel free to use these for your content, posts, and MEMES.
 6 | 
 7 | - logos with transparent backgrounds  
 8 | - wordmark  
 9 | - vector files  
10 | - banners  
11 | - gifs  
12 | 
13 | find <a href="https://drive.google.com/drive/folders/1_YcVZLHifPU8tBgXJ8Ecbb8vEnNONcKD"><b><i>here</i></b></a> - and we shall keep updating these.  
14 | So make sure you <b>BOOKMARK</b> it."""
15 | 
16 | messages = [message_1]
17 | 


--------------------------------------------------------------------------------
/combot/scheduled_warnings.py:
--------------------------------------------------------------------------------
 1 | message_1 = """<b>Important Security Notice </b>
 2 | 
 3 | Arc complex admins will <b>NEVER DM</b> you first.  Ignore and block any unsolicited messages.
 4 | 
 5 | - No new launches or airdrops are happening.
 6 | - Always verify updates via pinned announcements.
 7 | - The user <b><i>Arc complex</i></b> will not post in this group.  Any usernames similar who post in group or DM you - please <b>REPORT</b> and block!
 8 | - Be mindful of Ex contributors who may send DMs.
 9 | - To obtain a current list of arc admins, please use this command: /adminlist"""
10 | 
11 | message_2 = """We're seeing increased attempts by scammers impersonating Arc leadership.
12 | 
13 | <b>IMPORTANT FACTS:</b>
14 | 
15 | Arc and its team are <b>NOT</b> involved in any "rugging," "scamming," or "shorting" activities. Scammers are creating fake accounts that look similar to our CEO and admins. Any screenshots with talks about manipulating price or special dapps should be reported and are not legitimate. These impersonators may contact you via DM or even post in community spaces.
16 | 
17 | <b>PROTECT YOURSELF:</b>
18 | 
19 | Arc admins will <b>NEVER</b> initiate DMs with community members. Be mindful of Ex contributors who may send DMs. All official announcements come <b>ONLY</b> through pinned messages in official channels.
20 | 
21 | Verify any concerning claims through official channels before taking action.
22 | 
23 | Immediately report and block any suspicious accounts.
24 | 
25 | <b>VERIFICATION:</b>
26 | 
27 | To see the list of legitimate Arc administrators, use: /adminlist
28 | 
29 | <b>Stay vigilant. Report suspicious activity. Trust only official channels.</b>"""
30 | 
31 | messages = [message_1, message_2]


--------------------------------------------------------------------------------
/data/achievements/github_achievements.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "dataset_name": "github_achievements",
 3 |   "created_at": "2025-05-19T03:30:46.496605+00:00",
 4 |   "entries": [
 5 |     {
 6 |       "id": "0140777a-3769-47bc-9400-338385c09e82",
 7 |       "timestamp": "2025-05-19T03:29:55.405942+00:00",
 8 |       "messages": [
 9 |         "\ud83c\udf89 Github Star milestone reached: 3000 stars!",
10 |         "\ud83c\udf89 Github Fork milestone reached: 300 forks!"
11 |       ]
12 |     }
13 |   ],
14 |   "last_star_milestone": 3000,
15 |   "last_fork_milestone": 300,
16 |   "last_release_version": null
17 | }


--------------------------------------------------------------------------------
/data/achievements/telegram_achievements.json:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/data/achievements/telegram_achievements.json


--------------------------------------------------------------------------------
/data/achievements/token_holder_achievements.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "dataset_name": "token_holder_achievements",
 3 |   "created_at": "2025-05-19T03:30:46.503607+00:00",
 4 |   "entries": [
 5 |     {
 6 |       "id": "01a0a598-fec7-4235-b9b7-680fb80718a3",
 7 |       "timestamp": "2025-05-19T03:30:33.794754+00:00",
 8 |       "messages": [
 9 |         "\ud83c\udf89 Token holder milestone reached: 53000 holders!"
10 |       ]
11 |     }
12 |   ],
13 |   "last_holder_milestone": 53000
14 | }


--------------------------------------------------------------------------------
/data/achievements/x_follower_achievements.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "dataset_name": "x_follower_achievements",
 3 |   "created_at": "2025-05-19T03:30:46.516604+00:00",
 4 |   "entries": [
 5 |     {
 6 |       "id": "c27ff161-1b35-47ea-86c7-8ea60be0cf57",
 7 |       "timestamp": "2025-05-19T03:30:46.494605Z",
 8 |       "messages": [
 9 |         "\ud83c\udf89 X Follower milestone reached: 50000 followers!"
10 |       ]
11 |     }
12 |   ],
13 |   "last_follower_milestone": 50000
14 | }


--------------------------------------------------------------------------------
/data/metrics/daily/github_metrics.json:
--------------------------------------------------------------------------------
  1 | {
  2 |   "dataset_name": "github_metrics",
  3 |   "created_at": "2025-05-18T08:20:40.856870+00:00",
  4 |   "entries": [
  5 |     {
  6 |       "id": "b8e0d1da-f91f-4771-bd5a-ccc09fd226c2",
  7 |       "timestamp": "2025-05-18T08:20:40.855869+00:00",
  8 |       "stars": 3629,
  9 |       "forks": 392,
 10 |       "release_version": "rig-core-v0.12.0"
 11 |     },
 12 |     {
 13 |       "id": "04a6fbf9-04f0-463b-b24d-4a2889125fb7",
 14 |       "timestamp": "2025-05-18T08:24:19.750423+00:00",
 15 |       "stars": 3629,
 16 |       "forks": 392,
 17 |       "release_version": "rig-core-v0.12.0"
 18 |     },
 19 |     {
 20 |       "id": "f20e0bd5-1ccf-4692-8dc4-950cc9a5d083",
 21 |       "timestamp": "2025-05-18T09:12:14.739764+00:00",
 22 |       "stars": 3629,
 23 |       "forks": 392,
 24 |       "release_version": "rig-core-v0.12.0"
 25 |     },
 26 |     {
 27 |       "id": "7cff6ae5-bba9-4677-962a-268347aaffd7",
 28 |       "timestamp": "2025-05-18T18:45:23.867842+00:00",
 29 |       "stars": 3629,
 30 |       "forks": 392,
 31 |       "release_version": "rig-core-v0.12.0"
 32 |     },
 33 |     {
 34 |       "id": "8cb456dc-4a56-464f-8cd2-d285f3f6ad82",
 35 |       "timestamp": "2025-05-18T18:47:00.191824+00:00",
 36 |       "stars": 3629,
 37 |       "forks": 392,
 38 |       "release_version": "rig-core-v0.12.0"
 39 |     },
 40 |     {
 41 |       "id": "053f8428-49a1-480a-ab04-e7befdd6fb27",
 42 |       "timestamp": "2025-05-18T18:48:07.325257+00:00",
 43 |       "stars": 3629,
 44 |       "forks": 392,
 45 |       "release_version": "rig-core-v0.12.0"
 46 |     },
 47 |     {
 48 |       "id": "fda031f9-833f-480b-a8c7-f54e1dd0c217",
 49 |       "timestamp": "2025-05-18T18:51:17.938483+00:00",
 50 |       "stars": 3629,
 51 |       "forks": 392,
 52 |       "release_version": "rig-core-v0.12.0"
 53 |     },
 54 |     {
 55 |       "id": "09d149e8-6254-4a97-91b7-de580f6810bb",
 56 |       "timestamp": "2025-05-18T20:20:30.292446+00:00",
 57 |       "stars": 3629,
 58 |       "forks": 392,
 59 |       "release_version": "rig-core-v0.12.0"
 60 |     },
 61 |     {
 62 |       "id": "a5cc5d3e-1575-4b41-bab9-e02d251632e2",
 63 |       "timestamp": "2025-05-18T20:23:03.719346+00:00",
 64 |       "stars": 3629,
 65 |       "forks": 392,
 66 |       "release_version": "rig-core-v0.12.0"
 67 |     },
 68 |     {
 69 |       "id": "421ebefa-ac77-45f0-8177-7c61b4363355",
 70 |       "timestamp": "2025-05-18T20:25:48.547759+00:00",
 71 |       "stars": 3629,
 72 |       "forks": 392,
 73 |       "release_version": "rig-core-v0.12.0"
 74 |     },
 75 |     {
 76 |       "id": "0e5135ec-ca20-4916-b57b-f83ff0d6eddb",
 77 |       "timestamp": "2025-05-19T01:53:31.071175+00:00",
 78 |       "stars": 3629,
 79 |       "forks": 392,
 80 |       "release_version": "rig-core-v0.12.0"
 81 |     },
 82 |     {
 83 |       "id": "f7398b48-f6dc-4407-8d69-536c652b37bd",
 84 |       "timestamp": "2025-05-19T01:56:49.854069+00:00",
 85 |       "stars": 3629,
 86 |       "forks": 392,
 87 |       "release_version": "rig-core-v0.12.0"
 88 |     },
 89 |     {
 90 |       "id": "41b96c12-7da1-4ff5-81ec-de253430c6cb",
 91 |       "timestamp": "2025-05-19T02:14:32.617651+00:00",
 92 |       "stars": 3629,
 93 |       "forks": 392,
 94 |       "release_version": "rig-core-v0.12.0"
 95 |     },
 96 |     {
 97 |       "id": "3648c237-2fd4-40c6-b292-5fec7dd9801a",
 98 |       "timestamp": "2025-05-19T02:19:05.056106+00:00",
 99 |       "stars": 3629,
100 |       "forks": 392,
101 |       "release_version": "rig-core-v0.12.0"
102 |     },
103 |     {
104 |       "id": "00bd5e94-d701-4ea2-93b0-6d3d855b2c9c",
105 |       "timestamp": "2025-05-19T02:23:06.179233+00:00",
106 |       "stars": 3629,
107 |       "forks": 392,
108 |       "release_version": "rig-core-v0.12.0"
109 |     },
110 |     {
111 |       "id": "e6b79d5e-d548-42e9-b959-7ed2215365d2",
112 |       "timestamp": "2025-05-19T02:23:16.443305+00:00",
113 |       "stars": 3629,
114 |       "forks": 392,
115 |       "release_version": "rig-core-v0.12.0"
116 |     },
117 |     {
118 |       "id": "23cb1a6a-f49e-484c-9216-7724ccaa5a93",
119 |       "timestamp": "2025-05-19T02:26:42.419806+00:00",
120 |       "stars": 3629,
121 |       "forks": 392,
122 |       "release_version": "rig-core-v0.12.0"
123 |     },
124 |     {
125 |       "id": "44c26aed-26d4-48bf-99c4-6ce180153005",
126 |       "timestamp": "2025-05-19T02:27:56.539112+00:00",
127 |       "stars": 3629,
128 |       "forks": 392,
129 |       "release_version": "rig-core-v0.12.0"
130 |     },
131 |     {
132 |       "id": "cc6c4a07-fbb5-480e-a944-78e7bcff1e8c",
133 |       "timestamp": "2025-05-19T02:29:16.409098+00:00",
134 |       "stars": 3629,
135 |       "forks": 392,
136 |       "release_version": "rig-core-v0.12.0"
137 |     },
138 |     {
139 |       "id": "fc191933-f2c9-42fd-9df0-bbcdeb36d1fb",
140 |       "timestamp": "2025-05-19T02:32:51.829547+00:00",
141 |       "stars": 3629,
142 |       "forks": 392,
143 |       "release_version": "rig-core-v0.12.0"
144 |     },
145 |     {
146 |       "id": "86b94da3-67ce-44a5-b2a8-c27354ab93bc",
147 |       "timestamp": "2025-05-19T02:34:24.923696+00:00",
148 |       "stars": 3629,
149 |       "forks": 392,
150 |       "release_version": "rig-core-v0.12.0"
151 |     },
152 |     {
153 |       "id": "28e3cc3c-8344-4f65-ab86-7dd2103d17a6",
154 |       "timestamp": "2025-05-19T02:36:12.550054+00:00",
155 |       "stars": 3629,
156 |       "forks": 392,
157 |       "release_version": "rig-core-v0.12.0"
158 |     },
159 |     {
160 |       "id": "18487f03-ad2b-462c-a4f9-a7b0a42a09c4",
161 |       "timestamp": "2025-05-19T02:52:11.918187+00:00",
162 |       "stars": 3629,
163 |       "forks": 392,
164 |       "release_version": "rig-core-v0.12.0"
165 |     },
166 |     {
167 |       "id": "887e0958-c1bf-4d71-8b24-72c7a3dfe03d",
168 |       "timestamp": "2025-05-19T02:55:22.998832+00:00",
169 |       "stars": 3629,
170 |       "forks": 392,
171 |       "release_version": "rig-core-v0.12.0"
172 |     },
173 |     {
174 |       "id": "39228e9b-aa30-498a-a1c7-0ddc68d20a97",
175 |       "timestamp": "2025-05-19T02:58:30.181388+00:00",
176 |       "stars": 3630,
177 |       "forks": 392,
178 |       "release_version": "rig-core-v0.12.0"
179 |     },
180 |     {
181 |       "id": "d505adfc-a5d6-47ba-a53d-7a10ae6653a8",
182 |       "timestamp": "2025-05-19T03:00:20.884448+00:00",
183 |       "stars": 3630,
184 |       "forks": 392,
185 |       "release_version": "rig-core-v0.12.0"
186 |     },
187 |     {
188 |       "id": "24530fae-602c-4c3e-b11b-8e6adf83e5a7",
189 |       "timestamp": "2025-05-19T03:02:27.291567+00:00",
190 |       "stars": 3630,
191 |       "forks": 392,
192 |       "release_version": "rig-core-v0.12.0"
193 |     },
194 |     {
195 |       "id": "6a4d4bdd-2579-4176-bd7f-ffe0ec1ba6f2",
196 |       "timestamp": "2025-05-19T03:11:30.085976+00:00",
197 |       "stars": 3630,
198 |       "forks": 392,
199 |       "release_version": "rig-core-v0.12.0"
200 |     },
201 |     {
202 |       "id": "89e293b4-a00e-4131-9eb2-2bbaac299343",
203 |       "timestamp": "2025-05-19T03:14:08.531721+00:00",
204 |       "stars": 3630,
205 |       "forks": 392,
206 |       "release_version": "rig-core-v0.12.0"
207 |     },
208 |     {
209 |       "id": "917bb4ba-35dd-4462-92ba-b80f6f8e0b0f",
210 |       "timestamp": "2025-05-19T03:16:28.187738+00:00",
211 |       "stars": 3630,
212 |       "forks": 392,
213 |       "release_version": "rig-core-v0.12.0"
214 |     },
215 |     {
216 |       "id": "1908d0ec-03db-453a-9a98-19581f8436b0",
217 |       "timestamp": "2025-05-19T03:18:53.460686+00:00",
218 |       "stars": 3630,
219 |       "forks": 392,
220 |       "release_version": "rig-core-v0.12.0"
221 |     },
222 |     {
223 |       "id": "27a30038-a7b6-45b6-a38a-b35290d2b038",
224 |       "timestamp": "2025-05-19T03:21:48.558642+00:00",
225 |       "stars": 3630,
226 |       "forks": 392,
227 |       "release_version": "rig-core-v0.12.0"
228 |     },
229 |     {
230 |       "id": "0140777a-3769-47bc-9400-338385c09e82",
231 |       "timestamp": "2025-05-19T03:29:55.405942+00:00",
232 |       "stars": 3630,
233 |       "forks": 392,
234 |       "release_version": "rig-core-v0.12.0"
235 |     },
236 |     {
237 |       "id": "1817346a-aa70-48a2-8bf9-cbd45be824a8",
238 |       "timestamp": "2025-05-19T03:31:15.408421+00:00",
239 |       "stars": 3630,
240 |       "forks": 392,
241 |       "release_version": "rig-core-v0.12.0"
242 |     },
243 |     {
244 |       "id": "75040917-7f91-4793-9035-e3099f7e7eb0",
245 |       "timestamp": "2025-05-19T03:37:40.381754+00:00",
246 |       "stars": 3630,
247 |       "forks": 392,
248 |       "release_version": "rig-core-v0.12.0"
249 |     },
250 |     {
251 |       "id": "0c59b192-39e7-4dcf-8540-7794ca02992f",
252 |       "timestamp": "2025-05-19T05:45:50.260418+00:00",
253 |       "stars": 3631,
254 |       "forks": 393,
255 |       "release_version": "rig-core-v0.12.0"
256 |     },
257 |     {
258 |       "id": "eeeea915-7ee5-4484-8472-4998924a498f",
259 |       "timestamp": "2025-05-19T05:55:35.261267+00:00",
260 |       "stars": 3631,
261 |       "forks": 393,
262 |       "release_version": "rig-core-v0.12.0"
263 |     },
264 |     {
265 |       "id": "4455c1ed-5c50-4159-be57-15480c607851",
266 |       "timestamp": "2025-05-20T00:59:43.581233+00:00",
267 |       "stars": 3637,
268 |       "forks": 394,
269 |       "release_version": "rig-core-v0.12.0"
270 |     },
271 |     {
272 |       "id": "2c297520-00d3-405f-8329-670ed4b4b5a5",
273 |       "timestamp": "2025-05-20T15:35:43.109369+00:00",
274 |       "stars": 3639,
275 |       "forks": 395,
276 |       "release_version": "rig-core-v0.12.0"
277 |     }
278 |   ]
279 | }


--------------------------------------------------------------------------------
/data/metrics/daily/telegram_metrics.json:
--------------------------------------------------------------------------------
  1 | {
  2 |   "dataset_name": "telegram_metrics",
  3 |   "created_at": "2025-05-20T00:59:43.275752+00:00",
  4 |   "entries": [
  5 |     {
  6 |       "id": "ad84f4cf-ce57-41c9-97dc-3d30f29ab5b9",
  7 |       "timestamp": "2025-05-18T09:12:14.546921+00:00",
  8 |       "member_count": 4
  9 |     },
 10 |     {
 11 |       "id": "d92ad482-425c-45e1-b5d0-85f2fe007f1e",
 12 |       "timestamp": "2025-05-18T18:45:23.404916+00:00",
 13 |       "member_count": 4
 14 |     },
 15 |     {
 16 |       "id": "e7352c8a-6bfe-47b7-914a-efbd3e2351a1",
 17 |       "timestamp": "2025-05-18T18:46:59.768450+00:00",
 18 |       "member_count": 4
 19 |     },
 20 |     {
 21 |       "id": "2a23bcdf-0861-49d7-9931-c4a7336bffd4",
 22 |       "timestamp": "2025-05-18T18:48:06.846394+00:00",
 23 |       "member_count": 4
 24 |     },
 25 |     {
 26 |       "id": "853e5245-d72f-4a44-9ed1-9a79de8e0047",
 27 |       "timestamp": "2025-05-18T18:51:17.499417+00:00",
 28 |       "member_count": 4
 29 |     },
 30 |     {
 31 |       "id": "ff69bdb3-a922-4777-bfc0-44219f587bf0",
 32 |       "timestamp": "2025-05-18T20:20:29.830984+00:00",
 33 |       "member_count": 4
 34 |     },
 35 |     {
 36 |       "id": "6f59f1bd-dbf6-49c8-b07a-5bc6de7ac420",
 37 |       "timestamp": "2025-05-18T20:23:03.276848+00:00",
 38 |       "member_count": 4
 39 |     },
 40 |     {
 41 |       "id": "922b908b-cdca-4f73-a42b-a5b7a10f2da6",
 42 |       "timestamp": "2025-05-18T20:25:48.116650+00:00",
 43 |       "member_count": 4
 44 |     },
 45 |     {
 46 |       "id": "6921b47d-aee7-46eb-b278-f7177d70d1d0",
 47 |       "timestamp": "2025-05-19T01:53:30.342517+00:00",
 48 |       "member_count": 4
 49 |     },
 50 |     {
 51 |       "id": "cf0b97cf-6cad-41bd-91d6-f53334dea11e",
 52 |       "timestamp": "2025-05-19T01:56:49.295241+00:00",
 53 |       "member_count": 4
 54 |     },
 55 |     {
 56 |       "id": "6294364e-f873-48ef-9f08-3819ee32cdaf",
 57 |       "timestamp": "2025-05-19T02:14:32.119028+00:00",
 58 |       "member_count": 4
 59 |     },
 60 |     {
 61 |       "id": "986962a8-3b86-4108-9b3e-82cca1d07aa3",
 62 |       "timestamp": "2025-05-19T02:19:04.540580+00:00",
 63 |       "member_count": 4
 64 |     },
 65 |     {
 66 |       "id": "d2a7fdbf-300e-45e4-87bb-6ca0510a70ee",
 67 |       "timestamp": "2025-05-19T02:23:05.688222+00:00",
 68 |       "member_count": 4
 69 |     },
 70 |     {
 71 |       "id": "ee162eb6-0da5-4b3d-a434-f0f14bbab7f3",
 72 |       "timestamp": "2025-05-19T02:23:16.119503+00:00",
 73 |       "member_count": 4
 74 |     },
 75 |     {
 76 |       "id": "95afde86-3b1c-4972-9d5f-1655b5a69029",
 77 |       "timestamp": "2025-05-19T02:26:41.865661+00:00",
 78 |       "member_count": 4
 79 |     },
 80 |     {
 81 |       "id": "a752f688-0ebf-4cd2-8392-afce9781c4ca",
 82 |       "timestamp": "2025-05-19T02:27:55.983293+00:00",
 83 |       "member_count": 4
 84 |     },
 85 |     {
 86 |       "id": "08f29a36-a655-4c5c-a74c-b04586de3339",
 87 |       "timestamp": "2025-05-19T02:29:15.954305+00:00",
 88 |       "member_count": 4
 89 |     },
 90 |     {
 91 |       "id": "cffde388-10a8-4fcb-ab90-3e84c1b837fa",
 92 |       "timestamp": "2025-05-19T02:32:51.297804+00:00",
 93 |       "member_count": 4
 94 |     },
 95 |     {
 96 |       "id": "9f6a7d2b-f0f0-48c8-aca8-5f9d992f2613",
 97 |       "timestamp": "2025-05-19T02:34:24.372264+00:00",
 98 |       "member_count": 4
 99 |     },
100 |     {
101 |       "id": "93d69703-477a-4ae5-a82f-22bcfc934167",
102 |       "timestamp": "2025-05-19T02:36:12.025950+00:00",
103 |       "member_count": 4
104 |     },
105 |     {
106 |       "id": "b5ce1a8c-49e0-43db-9041-e1793ed2344b",
107 |       "timestamp": "2025-05-19T02:52:11.352150+00:00",
108 |       "member_count": 4
109 |     },
110 |     {
111 |       "id": "5d613762-d94c-41a7-bd6a-86f63a61541b",
112 |       "timestamp": "2025-05-19T02:55:22.479037+00:00",
113 |       "member_count": 4
114 |     },
115 |     {
116 |       "id": "0322264f-dbcc-434e-8273-e32c499d4966",
117 |       "timestamp": "2025-05-19T02:58:29.623998+00:00",
118 |       "member_count": 4
119 |     },
120 |     {
121 |       "id": "66ff5895-540c-48dd-a06c-c04d8b331d45",
122 |       "timestamp": "2025-05-19T03:00:20.327665+00:00",
123 |       "member_count": 4
124 |     },
125 |     {
126 |       "id": "71d499cd-e522-4691-93f5-acf745ca2ffc",
127 |       "timestamp": "2025-05-19T03:02:26.742456+00:00",
128 |       "member_count": 4
129 |     },
130 |     {
131 |       "id": "2660282d-ccbf-4e2e-ad5a-36b9e8a3b805",
132 |       "timestamp": "2025-05-19T03:11:29.619267+00:00",
133 |       "member_count": 4
134 |     },
135 |     {
136 |       "id": "a7741624-a394-440e-80fb-3a6877f8a4e6",
137 |       "timestamp": "2025-05-19T03:14:07.965413+00:00",
138 |       "member_count": 4
139 |     },
140 |     {
141 |       "id": "179bd5d8-a320-4401-a333-1685cda28e44",
142 |       "timestamp": "2025-05-19T03:16:27.619193+00:00",
143 |       "member_count": 4
144 |     },
145 |     {
146 |       "id": "161dab3d-5dd7-42a4-9bdd-8e08977d56a4",
147 |       "timestamp": "2025-05-19T03:18:52.934163+00:00",
148 |       "member_count": 4
149 |     },
150 |     {
151 |       "id": "b876c08c-249f-4b13-b350-516b2d266884",
152 |       "timestamp": "2025-05-19T03:21:48.053499+00:00",
153 |       "member_count": 4
154 |     },
155 |     {
156 |       "id": "bb92de7d-b6fe-4644-b533-182b5257071d",
157 |       "timestamp": "2025-05-19T03:29:54.872697+00:00",
158 |       "member_count": 4
159 |     },
160 |     {
161 |       "id": "684bc0d7-6128-414d-965b-6156f7a85bef",
162 |       "timestamp": "2025-05-19T03:31:14.880912+00:00",
163 |       "member_count": 4
164 |     },
165 |     {
166 |       "id": "db98f2bd-d32d-40e1-9518-2b10a2ee3a0a",
167 |       "timestamp": "2025-05-19T03:37:39.833407+00:00",
168 |       "member_count": 4
169 |     },
170 |     {
171 |       "id": "f34f779c-1c21-454f-91e3-7c20aa1de450",
172 |       "timestamp": "2025-05-19T05:45:49.938774+00:00",
173 |       "member_count": 4
174 |     },
175 |     {
176 |       "id": "af8a4c35-8111-4a64-94e6-ddb735e55df5",
177 |       "timestamp": "2025-05-19T05:55:34.577342+00:00",
178 |       "member_count": 4
179 |     },
180 |     {
181 |       "id": "a6516977-f1af-469f-b439-7d7c32475c5b",
182 |       "timestamp": "2025-05-20T00:59:43.275733+00:00",
183 |       "member_count": 4
184 |     }
185 |   ]
186 | }


--------------------------------------------------------------------------------
/data/metrics/daily/token_holder_metrics.json:
--------------------------------------------------------------------------------
  1 | {
  2 |   "dataset_name": "token_holder_metrics",
  3 |   "created_at": "2025-05-20T15:36:08.184175+00:00",
  4 |   "entries": [
  5 |     {
  6 |       "id": "6719d5cd-2af4-4ba0-b0d8-5c9209fb4e7c",
  7 |       "timestamp": "2025-05-18T09:12:44.316291+00:00",
  8 |       "holder_count": 53597
  9 |     },
 10 |     {
 11 |       "id": "3dac00b8-506b-442a-9604-b7adfb3f610d",
 12 |       "timestamp": "2025-05-18T18:45:57.759183+00:00",
 13 |       "holder_count": 53618
 14 |     },
 15 |     {
 16 |       "id": "0ac03734-7f75-4adf-b6fd-7032682710be",
 17 |       "timestamp": "2025-05-18T18:47:37.931069+00:00",
 18 |       "holder_count": 53618
 19 |     },
 20 |     {
 21 |       "id": "0d93753d-7cd8-48d3-b9d8-40e6ba09b01b",
 22 |       "timestamp": "2025-05-18T18:48:50.180831+00:00",
 23 |       "holder_count": 53619
 24 |     },
 25 |     {
 26 |       "id": "92e0bf13-5bf7-4b2f-94c6-4d341dc66449",
 27 |       "timestamp": "2025-05-18T18:51:53.509613+00:00",
 28 |       "holder_count": 53618
 29 |     },
 30 |     {
 31 |       "id": "5261c382-ebe6-490e-92de-95124e033d1e",
 32 |       "timestamp": "2025-05-18T20:23:40.015048+00:00",
 33 |       "holder_count": 53615
 34 |     },
 35 |     {
 36 |       "id": "9725327b-2e2e-4026-9793-58a1642ea11d",
 37 |       "timestamp": "2025-05-18T20:26:28.998119+00:00",
 38 |       "holder_count": 53614
 39 |     },
 40 |     {
 41 |       "id": "69f50cd1-a700-4ee9-9ac8-9014abacaa3e",
 42 |       "timestamp": "2025-05-19T01:54:07.231191+00:00",
 43 |       "holder_count": 53609
 44 |     },
 45 |     {
 46 |       "id": "ef540470-8151-4f36-9d75-569f2038c735",
 47 |       "timestamp": "2025-05-19T01:57:30.837351+00:00",
 48 |       "holder_count": 53608
 49 |     },
 50 |     {
 51 |       "id": "b6b74780-72dc-4dbc-a150-83b9a35d1325",
 52 |       "timestamp": "2025-05-19T02:15:14.226673+00:00",
 53 |       "holder_count": 53603
 54 |     },
 55 |     {
 56 |       "id": "e3975c4f-77a7-474a-937e-666a2189d0fb",
 57 |       "timestamp": "2025-05-19T02:19:38.335201+00:00",
 58 |       "holder_count": 53605
 59 |     },
 60 |     {
 61 |       "id": "5229151a-e411-4b54-88f6-48163c1e6133",
 62 |       "timestamp": "2025-05-19T02:23:42.558770+00:00",
 63 |       "holder_count": 53605
 64 |     },
 65 |     {
 66 |       "id": "9e03e54a-a146-43fc-b63c-beaf4079744e",
 67 |       "timestamp": "2025-05-19T02:27:14.533651+00:00",
 68 |       "holder_count": 53606
 69 |     },
 70 |     {
 71 |       "id": "6300ca65-b396-417f-ae92-e8a55ab613fa",
 72 |       "timestamp": "2025-05-19T02:28:30.189573+00:00",
 73 |       "holder_count": 53605
 74 |     },
 75 |     {
 76 |       "id": "56135c46-22a7-4f40-b0c1-464ef54aed83",
 77 |       "timestamp": "2025-05-19T02:29:52.620811+00:00",
 78 |       "holder_count": 53605
 79 |     },
 80 |     {
 81 |       "id": "2799b696-2306-4b82-9d70-7e069005a6f6",
 82 |       "timestamp": "2025-05-19T02:33:35.849401+00:00",
 83 |       "holder_count": 53605
 84 |     },
 85 |     {
 86 |       "id": "b565c254-2b3b-42d3-932f-b87afd08a497",
 87 |       "timestamp": "2025-05-19T02:34:58.516958+00:00",
 88 |       "holder_count": 53605
 89 |     },
 90 |     {
 91 |       "id": "0259fb69-d91b-40f1-9bd8-ec9048c12064",
 92 |       "timestamp": "2025-05-19T02:36:54.306021+00:00",
 93 |       "holder_count": 53604
 94 |     },
 95 |     {
 96 |       "id": "c34e2108-5c10-4845-8bd6-abfe05a14057",
 97 |       "timestamp": "2025-05-19T02:52:43.112434+00:00",
 98 |       "holder_count": 53602
 99 |     },
100 |     {
101 |       "id": "26ada78e-e24f-4d41-9e16-e7920cd9d3e2",
102 |       "timestamp": "2025-05-19T02:55:54.998538+00:00",
103 |       "holder_count": 53604
104 |     },
105 |     {
106 |       "id": "5da941a8-6d48-43ad-8659-a5c982c43670",
107 |       "timestamp": "2025-05-19T02:59:10.714747+00:00",
108 |       "holder_count": 53604
109 |     },
110 |     {
111 |       "id": "e6169e89-4ae9-4259-bf34-ad1c4e4ee082",
112 |       "timestamp": "2025-05-19T03:01:00.860653+00:00",
113 |       "holder_count": 53605
114 |     },
115 |     {
116 |       "id": "757c5be2-ecd7-40e3-8315-6ed637f61e18",
117 |       "timestamp": "2025-05-19T03:03:05.580684+00:00",
118 |       "holder_count": 53607
119 |     },
120 |     {
121 |       "id": "719200f6-4042-44b5-9969-fa9fd9296e76",
122 |       "timestamp": "2025-05-19T03:12:07.736033+00:00",
123 |       "holder_count": 53606
124 |     },
125 |     {
126 |       "id": "718f6cda-2119-4cb8-8b7b-44172cfa495e",
127 |       "timestamp": "2025-05-19T03:14:37.054134+00:00",
128 |       "holder_count": 53605
129 |     },
130 |     {
131 |       "id": "8e1e3d39-b71c-42ec-92bb-0f8a5c00d495",
132 |       "timestamp": "2025-05-19T03:17:01.835714+00:00",
133 |       "holder_count": 53605
134 |     },
135 |     {
136 |       "id": "8ccd2bcd-076a-4aa0-8960-e5b9941e02fe",
137 |       "timestamp": "2025-05-19T03:19:34.061467+00:00",
138 |       "holder_count": 53603
139 |     },
140 |     {
141 |       "id": "c7a43653-72f5-4ce0-a84f-e57ab946f1ed",
142 |       "timestamp": "2025-05-19T03:22:33.118988+00:00",
143 |       "holder_count": 53603
144 |     },
145 |     {
146 |       "id": "01a0a598-fec7-4235-b9b7-680fb80718a3",
147 |       "timestamp": "2025-05-19T03:30:33.794754+00:00",
148 |       "holder_count": 53602
149 |     },
150 |     {
151 |       "id": "ce57f09c-d6bf-4e8f-a7ba-5a7452b39661",
152 |       "timestamp": "2025-05-19T03:31:50.366559+00:00",
153 |       "holder_count": 53602
154 |     },
155 |     {
156 |       "id": "08990af1-c92d-4537-9000-51d2bbfd3a28",
157 |       "timestamp": "2025-05-19T03:38:16.253544+00:00",
158 |       "holder_count": 53606
159 |     },
160 |     {
161 |       "id": "8c65262f-eb5c-4b7e-91ba-051c1e9a24fd",
162 |       "timestamp": "2025-05-19T05:46:16.361411+00:00",
163 |       "holder_count": 53656
164 |     },
165 |     {
166 |       "id": "751e047b-9187-4f46-96fb-102e86c80af1",
167 |       "timestamp": "2025-05-19T05:56:01.167018+00:00",
168 |       "holder_count": 53650
169 |     },
170 |     {
171 |       "id": "fa9d3681-2120-48ce-939d-7eb7d2a87ac3",
172 |       "timestamp": "2025-05-20T01:00:16.197326+00:00",
173 |       "holder_count": 53616
174 |     },
175 |     {
176 |       "id": "b65d2091-6e4c-4e04-b3d1-5a0cd49c14fd",
177 |       "timestamp": "2025-05-20T15:36:08.184161+00:00",
178 |       "holder_count": 53552
179 |     }
180 |   ]
181 | }


--------------------------------------------------------------------------------
/data/metrics/daily/x_follower_metrics.json:
--------------------------------------------------------------------------------
  1 | {
  2 |   "dataset_name": "x_follower_metrics",
  3 |   "created_at": "2025-05-18T18:48:56.337126Z",
  4 |   "entries": [
  5 |     {
  6 |       "id": "d08f3106-0e65-46f8-b36e-c1c9fb7c8cc8",
  7 |       "timestamp": "2025-05-18T18:48:56.337126Z",
  8 |       "followers": 50532
  9 |     },
 10 |     {
 11 |       "id": "07271c51-8538-451e-ae27-cd0e34d62206",
 12 |       "timestamp": "2025-05-18T18:51:59.695386Z",
 13 |       "followers": 50532
 14 |     },
 15 |     {
 16 |       "id": "1ce38992-65cd-4a7e-9cb9-cc24dab1b649",
 17 |       "timestamp": "2025-05-18T20:23:46.285739Z",
 18 |       "followers": 50527
 19 |     },
 20 |     {
 21 |       "id": "d77c3e68-80c0-4023-8d4e-cebd25f7bd0c",
 22 |       "timestamp": "2025-05-18T20:26:34.946099Z",
 23 |       "followers": 50527
 24 |     },
 25 |     {
 26 |       "id": "7602ab25-33d7-4a09-8106-48f4580e447e",
 27 |       "timestamp": "2025-05-19T01:54:27.119728Z",
 28 |       "followers": 50517
 29 |     },
 30 |     {
 31 |       "id": "8211bc44-5d5b-484a-9d20-1d055ab46ddc",
 32 |       "timestamp": "2025-05-19T01:57:36.787082Z",
 33 |       "followers": 50517
 34 |     },
 35 |     {
 36 |       "id": "29c8d265-892c-4d29-b089-fecd118aca98",
 37 |       "timestamp": "2025-05-19T02:15:27.583908Z",
 38 |       "followers": 50517
 39 |     },
 40 |     {
 41 |       "id": "5670fa26-faa9-458a-b014-79f3a293a666",
 42 |       "timestamp": "2025-05-19T02:19:44.794717Z",
 43 |       "followers": 50517
 44 |     },
 45 |     {
 46 |       "id": "df076df9-0a74-4913-b830-bb79fa89245a",
 47 |       "timestamp": "2025-05-19T02:23:49.086542Z",
 48 |       "followers": 50517
 49 |     },
 50 |     {
 51 |       "id": "78088484-9920-4336-b5d3-04909896b6ab",
 52 |       "timestamp": "2025-05-19T02:27:21.135409Z",
 53 |       "followers": 50517
 54 |     },
 55 |     {
 56 |       "id": "42acf3d4-4b10-4ec1-a2d8-041b1ce0c5c5",
 57 |       "timestamp": "2025-05-19T02:28:37.037430Z",
 58 |       "followers": 50517
 59 |     },
 60 |     {
 61 |       "id": "6983b52b-d7e8-4f04-ba44-6c6f139977fe",
 62 |       "timestamp": "2025-05-19T02:29:58.926090Z",
 63 |       "followers": 50517
 64 |     },
 65 |     {
 66 |       "id": "ad1d2fbe-cee3-4971-bad8-cfabec0a233f",
 67 |       "timestamp": "2025-05-19T02:33:41.773314Z",
 68 |       "followers": 50517
 69 |     },
 70 |     {
 71 |       "id": "45ff0ddd-f464-4a54-b139-545ebd2924db",
 72 |       "timestamp": "2025-05-19T02:35:05.022633Z",
 73 |       "followers": 50517
 74 |     },
 75 |     {
 76 |       "id": "0e0ac68e-ea45-4fa8-b684-7b594d149646",
 77 |       "timestamp": "2025-05-19T02:37:00.800913Z",
 78 |       "followers": 50517
 79 |     },
 80 |     {
 81 |       "id": "71f14a16-ac19-49b2-95cf-6858382cc83f",
 82 |       "timestamp": "2025-05-19T02:52:56.378596Z",
 83 |       "followers": 50507
 84 |     },
 85 |     {
 86 |       "id": "5cd67ba7-bd22-421a-8e05-f4388f50235d",
 87 |       "timestamp": "2025-05-19T02:56:01.122092Z",
 88 |       "followers": 50507
 89 |     },
 90 |     {
 91 |       "id": "d2f2f69d-63a3-49f6-8dba-922e649a30d7",
 92 |       "timestamp": "2025-05-19T02:59:17.119961Z",
 93 |       "followers": 50508
 94 |     },
 95 |     {
 96 |       "id": "1b46b5d9-9cb1-4d31-9cd6-0ee566979f5c",
 97 |       "timestamp": "2025-05-19T03:01:06.530789Z",
 98 |       "followers": 50508
 99 |     },
100 |     {
101 |       "id": "9c9bf536-0e04-470c-9ecd-02b4d8868acd",
102 |       "timestamp": "2025-05-19T03:03:11.957845Z",
103 |       "followers": 50508
104 |     },
105 |     {
106 |       "id": "141d177a-9168-4923-b667-900f4ca6dfcc",
107 |       "timestamp": "2025-05-19T03:12:21.223994Z",
108 |       "followers": 50508
109 |     },
110 |     {
111 |       "id": "c21dc4d3-0767-43b2-8eb1-3faff1a1046f",
112 |       "timestamp": "2025-05-19T03:14:42.888228Z",
113 |       "followers": 50508
114 |     },
115 |     {
116 |       "id": "9599b831-2fd7-4a76-9b84-37101e470735",
117 |       "timestamp": "2025-05-19T03:17:08.088554Z",
118 |       "followers": 50508
119 |     },
120 |     {
121 |       "id": "b8dbf3ed-1786-45fe-94de-c9040cb123f6",
122 |       "timestamp": "2025-05-19T03:19:39.882183Z",
123 |       "followers": 50508
124 |     },
125 |     {
126 |       "id": "74dd0710-5a30-4520-974a-557e93422a3d",
127 |       "timestamp": "2025-05-19T03:22:39.348765Z",
128 |       "followers": 50508
129 |     },
130 |     {
131 |       "id": "c27ff161-1b35-47ea-86c7-8ea60be0cf57",
132 |       "timestamp": "2025-05-19T03:30:46.494605Z",
133 |       "followers": 50508
134 |     },
135 |     {
136 |       "id": "46607d33-52cc-42cf-9dfa-48578f653542",
137 |       "timestamp": "2025-05-19T03:31:56.698003Z",
138 |       "followers": 50508
139 |     },
140 |     {
141 |       "id": "92ae3959-718c-4f83-b048-8f26c8c0ec82",
142 |       "timestamp": "2025-05-19T03:38:22.141888Z",
143 |       "followers": 50507
144 |     },
145 |     {
146 |       "id": "f1eb273e-58c6-4146-8c5a-cb539cc9ccba",
147 |       "timestamp": "2025-05-19T05:46:21.696775Z",
148 |       "followers": 50512
149 |     },
150 |     {
151 |       "id": "f8cfede3-a890-4a92-8f49-a7b337a38330",
152 |       "timestamp": "2025-05-19T05:56:10.671640Z",
153 |       "followers": 50513
154 |     },
155 |     {
156 |       "id": "37604030-c750-40ab-b01f-b8f92d334256",
157 |       "timestamp": "2025-05-20T01:00:23.626883Z",
158 |       "followers": 50558
159 |     },
160 |     {
161 |       "id": "328e2e42-8077-4cde-9126-c82575830253",
162 |       "timestamp": "2025-05-20T15:36:14.156124Z",
163 |       "followers": 50585
164 |     }
165 |   ]
166 | }


--------------------------------------------------------------------------------
/data/metrics/weekly/github_weekly_metrics.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "dataset_name": "github_weekly_metrics",
 3 |   "created_at": "2025-05-19T04:37:47.109462Z",
 4 |   "previous": {
 5 |     "stars": 3630,
 6 |     "forks": 392
 7 |   },
 8 |   "current": {
 9 |     "stars": 3630,
10 |     "forks": 600
11 |   },
12 |   "change": {
13 |     "stars": 0.0,
14 |     "forks": 53.06
15 |   }
16 | }


--------------------------------------------------------------------------------
/data/metrics/weekly/telegram_weekly_metrics.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "dataset_name": "telegram_weekly_metrics",
 3 |   "created_at": "2025-05-19T04:37:47.111462Z",
 4 |   "previous": {
 5 |     "member_count": 4
 6 |   },
 7 |   "current": {
 8 |     "member_count": 4
 9 |   },
10 |   "change": {
11 |     "member_count": 0.0
12 |   }
13 | }


--------------------------------------------------------------------------------
/data/metrics/weekly/token_holder_weekly_metrics.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "dataset_name": "token_holder_weekly_metrics",
 3 |   "created_at": "2025-05-19T04:37:47.112462Z",
 4 |   "previous": {
 5 |     "holder_count": 53606
 6 |   },
 7 |   "current": {
 8 |     "holder_count": 53606
 9 |   },
10 |   "change": {
11 |     "holder_count": 0.0
12 |   }
13 | }


--------------------------------------------------------------------------------
/data/metrics/weekly/x_follower_weekly_metrics.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "dataset_name": "x_follower_weekly_metrics",
 3 |   "created_at": "2025-05-19T04:37:47.113462Z",
 4 |   "previous": {
 5 |     "followers": 50507
 6 |   },
 7 |   "current": {
 8 |     "followers": 50507
 9 |   },
10 |   "change": {
11 |     "followers": 0.0
12 |   }
13 | }


--------------------------------------------------------------------------------
/filters/filters.json:
--------------------------------------------------------------------------------
  1 | {
  2 |   "agenttank_handshake": {
  3 |     "response_text": "https://www.arc.fun/details/tank\nhttps://x.com/arcdotfun/status/1899196887565324583",
  4 |     "media": "agenttank_handshake.mp4",
  5 |     "type": "video"
  6 |   },
  7 |   "/are_you_pilled_yet": {
  8 |     "response_text": "",
  9 |     "media": "are_you_pilled_yet.mp4",
 10 |     "type": "video"
 11 |   },
 12 |   "/handshake_complete": {
 13 |     "response_text": "",
 14 |     "media": "handshake_complete.mp4",
 15 |     "type": "video"
 16 |   },
 17 |   "handshake_complete": {
 18 |     "response_text": "",
 19 |     "media": "handshake_complete.mp4",
 20 |     "type": "video"
 21 |   },
 22 |   "fabelis_handshake": {
 23 |     "response_text": "https://www.arc.fun/details/fabel\nhttps://x.com/arcdotfun/status/1899181979662270778",
 24 |     "media": "fabelis_handshake.mp4",
 25 |     "type": "video"
 26 |   },
 27 |   "/join_the_ryzome": {
 28 |     "response_text": "",
 29 |     "media": "join_the_ryzome.mp4",
 30 |     "type": "video"
 31 |   },
 32 |   "/rig_trading_kit": {
 33 |     "response_text": "",
 34 |     "media": "rig_trading_kit.mp4",
 35 |     "type": "video"
 36 |   },
 37 |   "/what_is_coming": {
 38 |     "response_text": "",
 39 |     "media": "what_is_coming.mp4",
 40 |     "type": "video"
 41 |   },
 42 |   "/arc_ecosystem": {
 43 |     "response_text": "https://t.me/c/2303317223/138119",
 44 |     "media": null,
 45 |     "type": "text"
 46 |   },
 47 |   "/make_me_smile": {
 48 |     "response_text": "https://www.arc.fun/emblem",
 49 |     "media": "make_me_smile.jpg",
 50 |     "type": "image"
 51 |   },
 52 |   "/wake_up_degen": {
 53 |     "response_text": "",
 54 |     "media": "wake_up_degen.mp4",
 55 |     "type": "video"
 56 |   },
 57 |   "/arc_watching": {
 58 |     "response_text": "",
 59 |     "media": "arc_watching.mp4",
 60 |     "type": "video"
 61 |   },
 62 |   "/stay_curious": {
 63 |     "response_text": "",
 64 |     "media": "stay_curious.mp4",
 65 |     "type": "video"
 66 |   },
 67 |   "/the_prologue": {
 68 |     "response_text": "",
 69 |     "media": "the_prologue.mp4",
 70 |     "type": "video"
 71 |   },
 72 |   "/get_ryzomed": {
 73 |     "response_text": "/join_the_ryzome",
 74 |     "media": "join_the_ryzome.mp4",
 75 |     "type": "video"
 76 |   },
 77 |   "/give_us_sol": {
 78 |     "response_text": "",
 79 |     "media": "giveussol.mp4",
 80 |     "type": "video"
 81 |   },
 82 |   "/sort_us_out": {
 83 |     "response_text": "",
 84 |     "media": "sort_us_out.jpg",
 85 |     "type": "image"
 86 |   },
 87 |   "/the_complex": {
 88 |     "response_text": "",
 89 |     "media": "the_complex.mp4",
 90 |     "type": "video"
 91 |   },
 92 |   "/alanturing": {
 93 |     "response_text": "",
 94 |     "media": "alan_turing.mp4",
 95 |     "type": "video"
 96 |   },
 97 |   "/arc_angels": {
 98 |     "response_text": "",
 99 |     "media": "arc_angels.mp4",
100 |     "type": "video"
101 |   },
102 |   "/arc_begins": {
103 |     "response_text": "",
104 |     "media": "arc_begins.mp4",
105 |     "type": "video"
106 |   },
107 |   "/arc_x_tank": {
108 |     "response_text": "",
109 |     "media": "arc_x_tank.mp4",
110 |     "type": "video"
111 |   },
112 |   "/tokenomics": {
113 |     "response_text": "https://www.arc.fun/tokenomics",
114 |     "media": null,
115 |     "type": "text"
116 |   },
117 |   "/what_is_it": {
118 |     "response_text": "",
119 |     "media": "what_is_it.mp4",
120 |     "type": "video"
121 |   },
122 |   "/which_pill": {
123 |     "response_text": "",
124 |     "media": "which_pill.jpg",
125 |     "type": "image"
126 |   },
127 |   "/arc_merch": {
128 |     "response_text": "",
129 |     "media": "arc_merch.mp4",
130 |     "type": "video"
131 |   },
132 |   "/build_rig": {
133 |     "response_text": "",
134 |     "media": "build_rig.mp4",
135 |     "type": "video"
136 |   },
137 |   "dev wallet": {
138 |     "response_text": "https://solscan.io/account/FXkGydbnG4jHVYqbBWWG4kkkwCpz6YEeVtM1vA6kZLaS",
139 |     "media": null,
140 |     "type": "text"
141 |   },
142 |   "playground": {
143 |     "response_text": "https://rig.rs/",
144 |     "media": null,
145 |     "type": "text"
146 |   },
147 |   "/we_evolve": {
148 |     "response_text": "",
149 |     "media": "we_evolve.mp4",
150 |     "type": "video"
151 |   },
152 |   "/archtech": {
153 |     "response_text": "https://www.arc.fun/architecture",
154 |     "media": null,
155 |     "type": "text"
156 |   },
157 |   "handshake": {
158 |     "response_text": "arc.fun/handshake",
159 |     "media": null,
160 |     "type": "text"
161 |   },
162 |   "litepaper": {
163 |     "response_text": "https://x.com/0thTachi/status/1898115871425675634",
164 |     "media": null,
165 |     "type": "text"
166 |   },
167 |   "/se.arc.h": {
168 |     "response_text": "",
169 |     "media": "search.mp4",
170 |     "type": "video"
171 |   },
172 |   "/se_arc_h": {
173 |     "response_text": "",
174 |     "media": "search.mp4",
175 |     "type": "video"
176 |   },
177 |   "se-arc-h": {
178 |     "response_text": "",
179 |     "media": "search.mp4",
180 |     "type": "video"
181 |   },
182 |   "search": {
183 |     "response_text": "",
184 |     "media": "search.mp4",
185 |     "type": "video"
186 |   },
187 |   "/chinese": {
188 |     "response_text": "抱歉！我们的中文指令被熊猫抱走了，正在抢救回来",
189 |     "media": null,
190 |     "type": "text"
191 |   },
192 |   "/roadmap": {
193 |     "response_text": "",
194 |     "media": "roadmap.jpg",
195 |     "type": "image"
196 |   },
197 |   "telegram": {
198 |     "response_text": "https://t.me/+CI-vivonuApiZWQ0",
199 |     "media": null,
200 |     "type": "text"
201 |   },
202 |   "discord": {
203 |     "response_text": "https://discord.com/invite/playgrounds",
204 |     "media": null,
205 |     "type": "text"
206 |   },
207 |   "/emblem": {
208 |     "response_text": "throughout history, symbols have sparked revolutions, fueled movements, and galvanized individuals around a shared purpose.\n\nfrom ancient heraldry to modern insignias, an emblem is a rallying cry that captures the heart and vision of a community.\n\nwe build rig, rig builds us",
209 |     "media": "emblem.mp4",
210 |     "type": "video"
211 |   },
212 |   "twitter": {
213 |     "response_text": "https://twitter.com/arcdotfun",
214 |     "media": null,
215 |     "type": "text"
216 |   },
217 |   "/we_arc": {
218 |     "response_text": "",
219 |     "media": "we_arc.mp4",
220 |     "type": "video"
221 |   },
222 |   "website": {
223 |     "response_text": "arc.fun",
224 |     "media": null,
225 |     "type": "text"
226 |   },
227 |   "/aa#00": {
228 |     "response_text": "",
229 |     "media": "aa#00.mp4",
230 |     "type": "video"
231 |   },
232 |   "/aa00": {
233 |     "response_text": "",
234 |     "media": "aa#00.mp4",
235 |     "type": "video"
236 |   },
237 |   "github": {
238 |     "response_text": "https://github.com/0xplaygrounds/rig",
239 |     "media": null,
240 |     "type": "text"
241 |   },
242 |   "/hello": {
243 |     "response_text": "",
244 |     "media": "ready.mp4",
245 |     "type": "video"
246 |   },
247 |   "/ready": {
248 |     "response_text": "",
249 |     "media": "ready.mp4",
250 |     "type": "video"
251 |   },
252 |   "forge": {
253 |     "response_text": "https://www.arc.fun/forge",
254 |     "media": null,
255 |     "type": "text"
256 |   },
257 |   "/shhh": {
258 |     "response_text": "",
259 |     "media": "arc_white.jpg",
260 |     "type": "image"
261 |   },
262 |   "ama1": {
263 |     "response_text": "https://x.com/RangeRope/status/1872441471472910371",
264 |     "media": null,
265 |     "type": "text"
266 |   },
267 |   "/arc": {
268 |     "response_text": "⸅◟_◞⸅",
269 |     "media": null,
270 |     "type": "text"
271 |   },
272 |   "/cex": {
273 |     "response_text": "Kucoin, Bitget, Lbank, Bitmart, XT, Poloniex, Mexc, Coinex, Ourbit, Bitmax, KCEX, gate io, Bybit, Coin W, Kraken",
274 |     "media": null,
275 |     "type": "text"
276 |   },
277 |   "site": {
278 |     "response_text": "arc.fun",
279 |     "media": null,
280 |     "type": "text"
281 |   },
282 |   "ama": {
283 |     "response_text": "https://x.com/0thTachi/status/1876377934652412160",
284 |     "media": null,
285 |     "type": "text"
286 |   },
287 |   "/ar": {
288 |     "response_text": "https://www.arc.fun/registry",
289 |     "media": null,
290 |     "type": "text"
291 |   },
292 |   "dex": {
293 |     "response_text": "https://dexscreener.com/solana/j3b6dvhes2y1cbmtvz5tcwxnegsjjdbukxduvdpoqms7",
294 |     "media": null,
295 |     "type": "text"
296 |   },
297 |   "ca": {
298 |     "response_text": "61V8vBaqAGMpgDQi4JcAwo1dmBGHsyhzodcPqnEVpump",
299 |     "media": null,
300 |     "type": "text"
301 |   },
302 |   "pg": {
303 |     "response_text": "https://rig.rs/",
304 |     "media": null,
305 |     "type": "text"
306 |   },
307 |   "/adminlist": {
308 |     "response_text": "Admins in arc complex:\n- @arc_complex, owner\n- @Solamigoodman01 (Arc Alchemist)\n- @kezofutura (Arc Alchemist)\n- @joshmo_dev (Arc Alchemist)\n-  (Arc Alchemist)\n- @oxjoblo (Arc Whisperer)\n- @CryptoHypeMan (Arc Alchemist)\n- @diamondhandzs (Arc Alchemist)\n- @rin_0xtohsaka\n- @Tachikoma000 (Arc High Priest)\n- @mateobelanger\n- @philostopher (Arc Wizard)\n- @mochan0x (Arc Wizard)\n\nNote: These are up-to-date values.",
309 |     "media": null,
310 |     "type": "text"
311 |   },
312 |   "/blog": {
313 |     "response_text": "https://www.arc.fun/blog",
314 |     "media": null,
315 |     "type": "text"
316 |   }
317 | }
318 | 


--------------------------------------------------------------------------------
/filters/growth.json:
--------------------------------------------------------------------------------
1 | {
2 |   "last_weekly_metrics_message": "\u2b50\ufe0f GitHub Stars >> 3,630 (+0.00%)\n\ud83c\udf74 GitHub Forks >> 392 (+0.00%)\n\n\ud83d\udc65 Telegram Members >> 4 (+0.00%)\n\n\ud83d\udc8a $ARC Holders >> 53,606 (+0.00%)\n\n\ud83d\udc26 X Followers >> 50,507 (+0.00%)\n"
3 | }


--------------------------------------------------------------------------------
/filters/metrics.json:
--------------------------------------------------------------------------------
1 | {
2 |   "last_metrics_message": "\u2b50\ufe0f Github Stars  >>  3,639\n\ud83c\udf74 Github Forks  >>  395\n\ud83d\udd16 Rig Version   >>  rig-core-v0.12.0\n\n\u274c Error fetching Telegram member count.\n\n\ud83d\udc8a $ARC Holders  >>  53,552\n\n\ud83d\udc26 X Followers  >>  50,585"
3 | }


--------------------------------------------------------------------------------
/filters/posts.json:
--------------------------------------------------------------------------------
1 | {
2 |   "latest_posts_message": "🧵 **Latest Posts:**\n\n---\n\n**arcdotfun**  \n🕒 05/14/2025 10:30 PM  \n[View Post](https://x.com/arcdotfun/status/1922781686355378317)\n\n---\n\n**arcdotfun**  \n🕒 04/08/2025 03:11 PM  \n[View Post](https://x.com/arcdotfun/status/1909625026690924602)\n\n---\n\n**arcdotfun**  \n🕒 03/11/2025 05:39 PM  \n[View Post](https://x.com/arcdotfun/status/1899515473370177778)\n\n---\n\n**arcdotfun**  \n🕒 02/10/2025 08:46 PM  \n[View Post](https://x.com/arcdotfun/status/1889053268162044242)\n\n---\n\n**arcdotfun**  \n🕒 01/14/2025 03:32 PM  \n[View Post](https://x.com/arcdotfun/status/1879189754685636997)\n\n---\n\n**arcdotfun**  \n🕒 01/10/2025 02:34 PM  \n[View Post](https://x.com/arcdotfun/status/1877725727946150258)\n\n---\n\n**arcdotfun**  \n🕒 01/10/2025 01:56 PM  \n[View Post](https://x.com/arcdotfun/status/1877716214648074459)\n\n---\n\n**arcdotfun**  \n🕒 12/11/2024 03:27 AM  \n[View Post](https://x.com/arcdotfun/status/1866686105044533431)\n\n---\n\n**arcdotfun**  \n🕒 12/03/2024 04:58 PM  \n[View Post](https://x.com/arcdotfun/status/1863991102560239905)\n\n---\n\n**arcdotfun**  \n🕒 11/29/2024 04:51 PM  \n[View Post](https://x.com/arcdotfun/status/1862539848713744735)\n\n---\n\n**0thTachi**  \n🕒 04/08/2025 04:17 PM  \n[View Post](https://x.com/0thTachi/status/1909641873121014233)\n\n---\n\n**0thTachi**  \n🕒 03/11/2025 05:44 PM  \n[View Post](https://x.com/0thTachi/status/1899516722245165416)\n\n---\n\n**0thTachi**  \n🕒 03/07/2025 08:57 PM  \n[View Post](https://x.com/0thTachi/status/1898115871425675634)\n\n---\n\n**0thTachi**  \n🕒 02/12/2025 10:04 PM  \n[View Post](https://x.com/0thTachi/status/1889797766513373259)\n\n---\n\n**0thTachi**  \n🕒 01/27/2025 10:50 PM  \n[View Post](https://x.com/0thTachi/status/1884011006365769836)\n\n---\n\n**0thTachi**  \n🕒 01/16/2025 10:11 PM  \n[View Post](https://x.com/0thTachi/status/1880015001852817513)\n\n---\n\n**0thTachi**  \n🕒 01/12/2025 04:18 PM  \n[View Post](https://x.com/0thTachi/status/1878476699970441688)\n\n---\n\n**0thTachi**  \n🕒 12/22/2024 05:35 PM  \n[View Post](https://x.com/0thTachi/status/1870885932594827333)\n\n---\n\n**Kezo_Futura**  \n🕒 05/08/2025 06:16 PM  \n[View Post](https://x.com/Kezo_Futura/status/1920543383803867593)\n\n---\n\n**Kezo_Futura**  \n🕒 04/09/2025 06:59 PM  \n[View Post](https://x.com/Kezo_Futura/status/1910044945492439539)\n\n---\n\n**Kezo_Futura**  \n🕒 03/28/2025 02:11 AM  \n[View Post](https://x.com/Kezo_Futura/status/1905442467828166833)\n\n---\n\n**Kezo_Futura**  \n🕒 03/27/2025 09:46 PM  \n[View Post](https://x.com/Kezo_Futura/status/1905376010968989956)\n\n---\n\n**Kezo_Futura**  \n🕒 02/13/2025 11:27 PM  \n[View Post](https://x.com/Kezo_Futura/status/1890181075034615951)\n\n---\n\n**Kezo_Futura**  \n🕒 01/15/2025 08:06 PM  \n[View Post](https://x.com/Kezo_Futura/status/1879621181273452774)\n\n---\n\n**Kezo_Futura**  \n🕒 01/12/2025 07:20 AM  \n[View Post](https://x.com/Kezo_Futura/status/1878341232654430457)\n\n---\n\n**Kezo_Futura**  \n🕒 03/06/2023 07:45 PM  \n[View Post](https://x.com/Kezo_Futura/status/1632829669564354560)\n\n---\n\n**Kezo_Futura**  \n🕒 12/22/2022 10:13 PM  \n[View Post](https://x.com/Kezo_Futura/status/1606050385474437120)\n\n---\n\n**Kezo_Futura**  \n🕒 12/22/2022 10:13 PM  \n[View Post](https://x.com/Kezo_Futura/status/1606050380747378688)\n\n---\n\n**Kezo_Futura**  \n🕒 11/03/2022 02:05 AM  \n[View Post](https://x.com/Kezo_Futura/status/1587989218873479169)"
3 | }


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/aa#00.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/agenttank_handshake.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/alan_turing.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/arc_angels.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/arc_begins.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/arc_merch.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/arc_watching.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/arc_white.jpg


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/arc_x_tank.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/are_you_pilled_yet.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/build_rig.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/deluge/arc_gif.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/emblem.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/fabelis_handshake.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/giveussol.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/handshake_complete.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/join_the_ryzome.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/make_me_smile.jpg


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/ready.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/rig_trading_kit.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/roadmap.jpg


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/search.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/sort_us_out.jpg


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/stay_curious.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/the_complex.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/the_prologue.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/wake_up_degen.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/we_arc.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/we_evolve.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/what_is_coming.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/what_is_it.mp4


--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/media/which_pill.jpg


--------------------------------------------------------------------------------
/metrics/daily/metrics.py:
--------------------------------------------------------------------------------
  1 | import sys
  2 | from pathlib import Path
  3 | import os
  4 | import json
  5 | import asyncio
  6 | from dotenv import load_dotenv
  7 | 
  8 | PROJECT_ROOT = Path(__file__).resolve().parents[2]
  9 | sys.path.append(str(PROJECT_ROOT))
 10 | 
 11 | from telegram import Bot
 12 | from api.telegram import get_telegram_stats
 13 | from api.holders import get_token_stats
 14 | from api.github import get_github_stats
 15 | from api.followers import get_x_followers_stats
 16 | 
 17 | from achievements.github_achievements import check_github_achievements
 18 | from achievements.telegram_achievements import check_telegram_achievements
 19 | from achievements.token_holder_achievements import check_token_holder_achievements
 20 | from achievements.x_follower_achievements import check_x_follower_achievements
 21 | 
 22 | load_dotenv()
 23 | 
 24 | BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
 25 | CHAT_ID = os.getenv("GROUP_CHAT_ID")
 26 | 
 27 | bot = Bot(token=BOT_TOKEN)
 28 | 
 29 | def send_update_to_tg(messages):
 30 |     """Sends a combined update message to the Telegram group."""
 31 |     full_message = "\n\n".join(messages)
 32 |     try:
 33 |         bot.send_message(chat_id=CHAT_ID, text=full_message)
 34 |     except Exception as e:
 35 |         print(f"Failed to send message to Telegram: {e}")
 36 |     return full_message
 37 | 
 38 | def save_last_metrics_message_as_filter(message):
 39 |     """Save the last sent message to /filters/metrics.json, overwriting previous content."""
 40 |     project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
 41 |     filters_dir = os.path.join(project_root, "filters")
 42 |     os.makedirs(filters_dir, exist_ok=True)
 43 | 
 44 |     data = {"last_metrics_message": message}
 45 |     metrics_path = os.path.join(filters_dir, "metrics.json")
 46 |     with open(metrics_path, "w", encoding="utf-8") as f:
 47 |         json.dump(data, f, indent=2)
 48 | 
 49 | async def main():
 50 |     # Telegram Metrics (sync)
 51 |     telegram_message = get_telegram_stats()
 52 |         
 53 |     # GitHub Metrics (sync)
 54 |     github_stats = get_github_stats()
 55 | 
 56 |     # Holders Metrics (sync)
 57 |     token_stats = get_token_stats()
 58 | 
 59 |     # Followers Metrics (async, so await it)
 60 |     x_followers_stats = await get_x_followers_stats()
 61 | 
 62 |     x_followers_message = x_followers_stats.get("data", {}).get("message", str(x_followers_stats))
 63 | 
 64 |     github_achievement_messages = check_github_achievements()
 65 |     telegram_achievement_messages = check_telegram_achievements() 
 66 |     token_holder_achievement_messages = check_token_holder_achievements()
 67 |     x_follower_achievement_messages = check_x_follower_achievements()
 68 | 
 69 |     # Create a list of messages
 70 |     core_messages = [
 71 |         github_stats,
 72 |         telegram_message,
 73 |         token_stats,
 74 |         x_followers_message
 75 |     ]
 76 | 
 77 |     messages = core_messages.copy()
 78 | 
 79 |     if github_achievement_messages or telegram_achievement_messages or token_holder_achievement_messages or x_follower_achievement_messages:
 80 |         separator = "────────────" * 3
 81 |         messages.append(separator)
 82 | 
 83 |     if github_achievement_messages:
 84 |         messages.extend(github_achievement_messages)
 85 | 
 86 |     if telegram_achievement_messages:
 87 |         messages.extend(telegram_achievement_messages)
 88 | 
 89 |     if token_holder_achievement_messages:
 90 |         messages.extend(token_holder_achievement_messages)
 91 | 
 92 |     if x_follower_achievement_messages:
 93 |         messages.extend(x_follower_achievement_messages)
 94 | 
 95 |     # Send all messages to Telegram (metrics + achievements)
 96 |     send_update_to_tg(messages)
 97 | 
 98 |     # Save only core metrics message (without achievements) as filter
 99 |     core_full_message = "\n\n".join(core_messages)
100 |     save_last_metrics_message_as_filter(core_full_message)
101 | 
102 | if __name__ == "__main__":
103 |     asyncio.run(main())
104 | 


--------------------------------------------------------------------------------
/metrics/weekly/metrics.py:
--------------------------------------------------------------------------------
  1 | import json
  2 | from pathlib import Path
  3 | from datetime import datetime
  4 | 
  5 | PROJECT_ROOT = Path(__file__).resolve().parents[2]
  6 | 
  7 | DAILY_DIR = PROJECT_ROOT / "data" / "metrics" / "daily"
  8 | WEEKLY_DIR = PROJECT_ROOT / "data" / "metrics" / "weekly"
  9 | FILTERS_DIR = PROJECT_ROOT / "filters"
 10 | FILTERS_DIR.mkdir(parents=True, exist_ok=True)
 11 | 
 12 | DATASETS = {
 13 |     "github_metrics": {
 14 |         "keys": ["stars", "forks"],
 15 |         "emojis": {"stars": "⭐️", "forks": "🍴"},
 16 |         "display_names": {"stars": "GitHub Stars", "forks": "GitHub Forks"},
 17 |     },
 18 |     "telegram_metrics": {
 19 |         "keys": ["member_count"],
 20 |         "emojis": {"member_count": "👥"},
 21 |         "display_names": {"member_count": "Telegram Members"},
 22 |     },
 23 |     "token_holder_metrics": {
 24 |         "keys": ["holder_count"],
 25 |         "emojis": {"holder_count": "💊"},
 26 |         "display_names": {"holder_count": "$ARC Holders"},
 27 |     },
 28 |     "x_follower_metrics": {
 29 |         "keys": ["followers"],
 30 |         "emojis": {"followers": "🐦"},
 31 |         "display_names": {"followers": "X Followers"},
 32 |     },
 33 | }
 34 | 
 35 | def load_json_file(path: Path):
 36 |     if not path.exists() or path.stat().st_size == 0:
 37 |         print(f"[!] File missing or empty: {path}")
 38 |         return None
 39 |     try:
 40 |         with open(path, "r", encoding="utf-8") as f:
 41 |             return json.load(f)
 42 |     except Exception as e:
 43 |         print(f"[!] Failed to load JSON {path}: {e}")
 44 |         return None
 45 | 
 46 | def save_json_file(path: Path, data):
 47 |     with open(path, "w", encoding="utf-8") as f:
 48 |         json.dump(data, f, indent=2)
 49 |     print(f"[✓] Saved file: {path.name}")
 50 | 
 51 | def calculate_pct_change(current_val, previous_val):
 52 |     try:
 53 |         if previous_val is None or previous_val == 0:
 54 |             return 0.0
 55 |         return round(((current_val - previous_val) / previous_val) * 100, 2)
 56 |     except Exception:
 57 |         return 0.0
 58 | 
 59 | def save_last_weekly_metrics_message(message: str):
 60 |     data = {"last_weekly_metrics_message": message}
 61 |     metrics_path = FILTERS_DIR / "growth.json"
 62 |     metrics_path.parent.mkdir(parents=True, exist_ok=True)  # ensure directory exists
 63 |     with open(metrics_path, "w", encoding="utf-8") as f:
 64 |         json.dump(data, f, indent=2)
 65 |     print(f"[✓] Saved last weekly metrics message to {metrics_path}")
 66 | 
 67 | def format_number(n):
 68 |     return f"{n:,}"
 69 | 
 70 | def update_weekly_metrics():
 71 |     updated_any = False
 72 |     message_lines = []
 73 | 
 74 |     for dataset_name, info in DATASETS.items():
 75 |         keys = info["keys"]
 76 |         emojis = info["emojis"]
 77 |         display_names = info["display_names"]
 78 | 
 79 |         daily_file = DAILY_DIR / f"{dataset_name}.json"
 80 |         weekly_filename = dataset_name.replace("_metrics", "_weekly_metrics") + ".json"
 81 |         weekly_file = WEEKLY_DIR / weekly_filename
 82 | 
 83 |         daily_data = load_json_file(daily_file)
 84 |         if not daily_data or "entries" not in daily_data or not daily_data["entries"]:
 85 |             print(f"[!] No daily data found for {dataset_name}. Skipping.")
 86 |             continue
 87 | 
 88 |         latest_record = daily_data["entries"][-1]
 89 | 
 90 |         weekly_data = load_json_file(weekly_file) or {}
 91 | 
 92 |         previous = weekly_data.get("current")
 93 |         current = {key: latest_record.get(key, 0) or 0 for key in keys}
 94 | 
 95 |         if previous is None:
 96 |             previous = current.copy()
 97 | 
 98 |         change = {}
 99 |         for key in keys:
100 |             cur_val = current.get(key, 0)
101 |             prev_val = previous.get(key, 0)
102 |             change[key] = calculate_pct_change(cur_val, prev_val)
103 | 
104 |         new_weekly_data = {
105 |             "dataset_name": dataset_name.replace("_metrics", "_weekly_metrics"),
106 |             "created_at": datetime.utcnow().isoformat() + "Z",
107 |             "previous": previous,
108 |             "current": current,
109 |             "change": change,
110 |         }
111 | 
112 |         save_json_file(weekly_file, new_weekly_data)
113 |         updated_any = True
114 | 
115 |         # Format each metric line, then join with newlines between keys of this dataset
116 |         for key in keys:
117 |             emoji = emojis.get(key, "")
118 |             display_name = display_names.get(key, key)
119 |             current_val = format_number(current.get(key, 0))
120 |             pct_change = f"{change[key]:+.2f}%"
121 |             message_lines.append(f"{emoji} {display_name} >> {current_val} ({pct_change})")
122 | 
123 |         # Add a blank line between datasets
124 |         message_lines.append("")
125 | 
126 |     if not updated_any:
127 |         print("[!] No metrics data found or updated.")
128 |         return False, ""
129 | 
130 |     full_message = "\n".join(message_lines)
131 |     return True, full_message
132 | 
133 | def main():
134 |     updated, message = update_weekly_metrics()
135 |     if updated:
136 |         save_last_weekly_metrics_message(message)
137 | 
138 | if __name__ == "__main__":
139 |     main()
140 | 


--------------------------------------------------------------------------------
/middleware_listener.py:
--------------------------------------------------------------------------------
 1 | import os
 2 | import re
 3 | from dotenv import load_dotenv
 4 | from telegram import Update, ParseMode, Bot
 5 | from telegram.ext import Updater, MessageHandler, Filters, CallbackContext
 6 | 
 7 | # Load .env variables
 8 | load_dotenv()
 9 | 
10 | # Bot token and group chat ID
11 | MIDDLEWARE_BOT_TOKEN = os.getenv("MIDDLEWARE_BOT_TOKEN")
12 | BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
13 | GROUP_CHAT_ID = int(os.getenv("GROUP_CHAT_ID"))
14 | 
15 | BUY_BOT_GIF = "media/deluge/arc_gif.mp4"
16 | 
17 | # Separate instance of bot using the main group chat bot
18 | main_bot = Bot(token=BOT_TOKEN)
19 | 
20 | def handle_say_command(update: Update, context: CallbackContext):
21 |     message = update.message or update.channel_post
22 |     if not message:
23 |         return
24 | 
25 |     message_text = message.text or ""
26 |     say_message = ""
27 | 
28 |     if message_text.lower().startswith('/say '):
29 |         say_message = message_text[5:].strip()
30 | 
31 |     if say_message:
32 |         try:
33 |             context.bot.delete_message(chat_id=update.effective_chat.id, message_id=message.message_id)
34 |         except Exception as e:
35 |             print(f"Failed to delete /say command: {e}")
36 | 
37 |         try:
38 |             main_bot.send_message(
39 |                 chat_id=GROUP_CHAT_ID,
40 |                 text=say_message,
41 |                 parse_mode=ParseMode.HTML
42 |             )
43 |             print(f"Relayed /say command: {say_message}")
44 |         except Exception as e:
45 |             print(f"Failed to send /say message to main group: {e}")
46 | 
47 | def handle_buy_command(update: Update, context: CallbackContext):
48 |     message = update.message or update.channel_post
49 |     if not message:
50 |         return
51 | 
52 |     message_text = message.text or ""
53 |     buy_message = ""
54 | 
55 |     if message_text.lower().startswith('/buy '):
56 |         buy_message = message_text[5:].strip()
57 | 
58 |     if buy_message:
59 |         try:
60 |             context.bot.delete_message(chat_id=update.effective_chat.id, message_id=message.message_id)
61 |         except Exception as e:
62 |             print(f"Failed to delete /buy command: {e}")
63 | 
64 |         try:
65 |             with open(BUY_BOT_GIF, "rb") as video:
66 |                 main_bot.send_video(
67 |                     chat_id=GROUP_CHAT_ID,
68 |                     video=video,
69 |                     caption=buy_message,
70 |                     parse_mode=ParseMode.HTML,
71 |                     supports_streaming=True                )
72 |             print(f"Relayed /buy command with video caption: {buy_message}")
73 |         except Exception as e:
74 |             print(f"Failed to send /buy video message to main group: {e}")
75 | 
76 | def main():
77 |     updater = Updater(MIDDLEWARE_BOT_TOKEN, use_context=True)
78 |     dp = updater.dispatcher
79 | 
80 |     dp.add_handler(MessageHandler(Filters.regex('^/say '), handle_say_command))
81 |     dp.add_handler(MessageHandler(Filters.regex('^/buy '), handle_buy_command))
82 | 
83 |     updater.start_polling()
84 |     updater.idle()
85 | 
86 | if __name__ == '__main__':
87 |     main()


--------------------------------------------------------------------------------
/railway.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "$schema": "https://railway.app/railway.schema.json",
 3 |   "build": {
 4 |     "builder": "RAILPACK",
 5 |     "buildCommand": "pip install -r requirements.txt"
 6 |   },
 7 |   "deploy": {
 8 |     "startCommand": "/bin/sh -c 'pip install -r requirements.txt && python bot.py & python middleware_listener.py & wait'"
 9 |   }
10 | }


--------------------------------------------------------------------------------
/requirements.txt:
--------------------------------------------------------------------------------
 1 | APScheduler==3.6.3
 2 | cachetools==4.2.2
 3 | certifi==2025.1.31
 4 | python-dotenv==1.1.0
 5 | python-telegram-bot==13.15
 6 | pytz==2025.2
 7 | six==1.17.0
 8 | tornado==6.1
 9 | tzdata==2025.2
10 | tzlocal==5.3.1
11 | requests==2.26.0
12 | playwright==1.35.0


--------------------------------------------------------------------------------
/whitelists/whitelist_phrases.txt:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/rangeroper/tg_mod/main/whitelists/whitelist_phrases.txt


---------------------------------------------------------