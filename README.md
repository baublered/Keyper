Project Overview
This project is a password manager built using the MEVN (MongoDB, Express, Vue, Node.js) stack. However, we do not use a database for storage, and the app relies on AES and RSA encryption algorithms to securely encrypt and decrypt passwords. The user can select between AES or RSA to encrypt passwords and view the encrypted and decrypted results, as well as performance metrics for each algorithm. Additionally, the app features password strength checking, password generation, and a password reveal option.

```
Features: 
    AES and RSA Encryption:
    - Encrypt and decrypt passwords using the AES and RSA algorithms.
    - Display encryption and decryption performance times (in milliseconds).
    Password Strength Checker:
    - Checks the strength of the entered password (Weak, Moderate, Strong).
    Password Generator:
    - Automatically generates a strong password with random characters.
    Password Reveal Option:
    - Toggle to show or hide the password (eye icon to toggle visibility).
    Clear All Button:
    - Clear all inputs and outputs.
```

Tech Stack
Frontend:
    Vue.js (for the UI)
    Vite (for development server)
    Axios (for making HTTP requests)
Backend:
    Node.js (for the server)
    Express.js (for creating API routes)
    crypto (for AES and RSA encryption)

Project Structure
Frontend (src/):
    App.vue: Main component for handling UI and logic for password encryption, decryption, password generation, strength checking, etc.
    style: Scoped styling for the app.
    dependencies: Vue.js, Axios for API communication.
Backend (server.js):
    Express API: Handles encryption and decryption requests.
    /encrypt: Endpoint to encrypt a password using the selected method (AES or RSA).
    /decrypt: Endpoint to decrypt the encrypted password using the provided method and key.

Encryption Algorithms:
    AES Encryption:
        128-bit key length.
        Uses crypto module to implement AES encryption.
    RSA Encryption:
        Uses a 2048-bit RSA public/private key pair.
        crypto module is used for RSA encryption/decryption.

```
How to Run
1. Install Backend Dependencies:
Navigate to the backend directory and run:

bash
Copy
Edit
npm install
2. Run the Backend:
Start the backend server:

bash
Copy
Edit
node server.js
This will start the server on http://localhost:3000.

3. Install Frontend Dependencies:
Navigate to the frontend directory and run:

bash
Copy
Edit
npm install
4. Run the Frontend:
Start the Vue development server:

bash
Copy
Edit
npm run dev
This will start the frontend on http://localhost:5173.

5. Open the App:
Visit http://localhost:5173 in your browser to use the password manager.

Functionality Overview
Password Input:

User can input a password, select encryption method (AES or RSA), and view the encrypted result.

The app also displays encryption and decryption times.

Password Strength Checker:

The app checks the strength of the password (Weak, Moderate, Strong) based on length and character variety.

Password Generator:

Click the "Generate Strong Password" button to generate a random, strong password with a mix of letters, numbers, and special characters.

Encryption and Decryption:

Users can choose AES or RSA encryption for their passwords.

The encrypted password is displayed along with the performance time.

Users can also decrypt the password using the correct decryption key and view the original password.

Password Reveal:

The user can toggle between showing and hiding the password with an eye icon.

Clear All:

A "Clear" button allows users to clear all fields, including the password input, encrypted output, and decrypted output.
```

Future Improvements:
    Implement local storage for saving passwords (instead of relying on the session).
    Add user authentication for better security.
    Store encrypted passwords using RSA or AES in a database.
    Implement multi-factor authentication (MFA).
    Add more encryption algorithms for variety.

Credits:
    This project uses crypto for encryption and decryption.
    Vue.js for frontend development.
    Express.js for backend development
