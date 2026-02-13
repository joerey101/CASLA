
import json

# Define common female names
female_names = ["Ana", "Lucia", "Maria", "Elena", "Paula", "Valentina", "Sofia", "Julia", "Martina", "Camila"]

mock_file = "src/lib/mockDb.json"

try:
    with open(mock_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for member in data.get('members', []):
        first_name = member.get('fullName', '').split(' ')[0]
        if first_name in female_names:
             member['avatarUrl'] = "/images/avatar_female_casla.png"
        else:
             member['avatarUrl'] = "/images/avatar_male_casla.png"

    with open(mock_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print("Success: Avatars updated based on gender inference.")

except Exception as e:
    print(f"Error: {e}")
