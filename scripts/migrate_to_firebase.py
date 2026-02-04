import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ai.firebase_face_model import FirebaseFaceModel
import base64
from pathlib import Path

def migrate_folders_to_firebase():
    """Migrate existing image_dataset folders to Firebase"""
    model = FirebaseFaceModel()
    dataset_path = Path(__file__).parent.parent / 'ai' / 'image_dataset'
    
    if not dataset_path.exists():
        print("No image_dataset folder found")
        return
    
    print("Migrating employees to Firebase...")
    
    for person_folder in dataset_path.iterdir():
        if not person_folder.is_dir():
            continue
        
        name = person_folder.name
        print(f"\nProcessing: {name}")
        
        # Get first image
        images = list(person_folder.glob('*.jpg')) + list(person_folder.glob('*.jpeg')) + list(person_folder.glob('*.png'))
        
        if not images:
            print(f"  No images found for {name}")
            continue
        
        image_path = images[0]
        
        # Convert to base64
        with open(image_path, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode()
            image_base64 = f"data:image/jpeg;base64,{image_data}"
        
        # Generate numeric ID (you may need to adjust this)
        numeric_id = hash(name) % 100000
        
        print(f"  Adding to Firebase with ID: {numeric_id}")
        success, message = model.add_employee(name, numeric_id, image_base64)
        print(f"  {message}")

if __name__ == '__main__':
    migrate_folders_to_firebase()
