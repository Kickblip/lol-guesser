import json

def format_names(filename):
    formatted_names = {}
    
    with open(filename, 'r') as file:
        names = file.read().splitlines()  # splitlines() method splits a string into a list where each line is an element
        
        for name in names:
            formatted_name = "{}_OriginalSkin.webp".format(name.capitalize())
            formatted_names[formatted_name] = name.lower()
            
    return formatted_names

names_dict = format_names('names.txt')

# Save to json file
with open('names.json', 'w') as json_file:
    json.dump(names_dict, json_file, indent=4)
