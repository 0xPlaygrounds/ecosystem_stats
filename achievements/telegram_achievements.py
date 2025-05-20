vements/telegram_achievements.py:
--------------------------------------------------------------------------
mport json
mport os
rom datetime import datetime, timezone

ELEGRAM_METRICS_FILE = "data/metrics/daily/telegram_metrics.json"
ELEGRAM_ACHIEVEMENTS_FILE = "data/achievements/telegram_achievements.json"

ef load_json_file(filepath):
   if not os.path.exists(filepath):
       return {}
   try:
       with open(filepath, "r") as f:
           data = json.load(f)
           return data
   except json.JSONDecodeError as e:
       return {}

ef save_json_file(filepath, data):
   os.makedirs(os.path.dirname(filepath), exist_ok=True)
   with open(filepath, "w") as f:
       json.dump(data, f, indent=2)

ef get_latest_metrics_entry(metrics):
   entries = metrics.get("entries")
   if not entries:
       return None
   # Sort by timestamp to get the latest entry
   latest = sorted(entries, key=lambda e: e["timestamp"], reverse=True)[0]
   return latest

ef check_member_count_milestones(latest_entry, achievements):
   milestones = []
   member_milestone_step = 500

   last_member_milestone = achievements.get("last_member_milestone", 0)
   member_count = latest_entry.get("member_count", 0)

   current_milestone = (member_count // member_milestone_step) * member_milestone_step

   if current_milestone > last_member_milestone:
       msg = f"🎉 Telegram Member milestone reached: {current_milestone} members!"
       milestones.append(msg)
       achievements["last_member_milestone"] = current_milestone

   return milestones, achievements

ef check_telegram_achievements():
   metrics = load_json_file(TELEGRAM_METRICS_FILE)
   achievements = load_json_file(TELEGRAM_ACHIEVEMENTS_FILE)

   if not achievements:
       achievements = {
           "dataset_name": "telegram_achievements",
           "created_at": datetime.now(timezone.utc).isoformat(),
           "entries": [],
           "last_member_milestone": 0
       }

   latest_entry = get_latest_metrics_entry(metrics)
   if not latest_entry:
       return []

   new_achievements = []

   milestone_msgs, achievements = check_member_count_milestones(latest_entry, achievements)
   new_achievements.extend(milestone_msgs)

   if new_achievements:
       achievement_entry = {
           "id": latest_entry["id"],
           "timestamp": latest_entry["timestamp"],
           "messages": new_achievements
       }
       achievements["entries"].append(achievement_entry)
       save_json_file(TELEGRAM_ACHIEVEMENTS_FILE, achievements)

   return new_achievements

f __name__ == "__main__":
   check_telegram_achievements()


--------------------------------------------------------------------------
vements/token_holder_achievements.py:
--------------------------------------------------------------------------
