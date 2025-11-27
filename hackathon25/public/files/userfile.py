import sys

def verify_and_reveal():
    """Reads credentials from an external file and verifies the user's input."""
    data_file_name = "data.enc" 

    try:
        with open(data_file_name, 'r') as f:
            expected_passkey = f.readline().strip()
            secret_message = f.readline().strip()

    except FileNotFoundError:
        print(f"\n[ERROR] Authentication data file '{data_file_name}' not found.")
        print("This script relies on external configuration data.")
        sys.exit(1)
    except Exception as e:
        print(f"\n[ERROR] An error occurred reading '{data_file_name}': {e}")
        sys.exit(1)
    username = input("\nEnter Username: ").strip()
    if not username:
        print("\n[INFO] Username cannot be empty. Please try again.")
        sys.exit(0)
    
    user_passkey = input("Enter Passkey: ").strip()


    if user_passkey == expected_passkey:
        print("\n[SUCCESS] Passkey accepted!")
        print("-" * 30)
        print(f"Secret Message: {secret_message}")
        print("-" * 30)
    else:
        print("\n[FAIL] Incorrect passkey. Access denied.")


if __name__ == "__main__":
    print("--- CTF Challenge Access Portal ---")
    verify_and_reveal()








#########/////////////////////obevatyvsr//////////////////////
##*********************pbqneg**************************
#==================jebatcnffxrl=======================
