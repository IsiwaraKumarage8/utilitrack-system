# ❓ Troubleshooting

## Backend Issues

**Problem: "Cannot connect to database"**

Solutions:
- Make sure SQL Server is running
- Check your username and password in `.env` are correct
- If using Windows Authentication, make sure `DB_USER` and `DB_PASSWORD` are empty (no values)
- Try adding `\\SQLEXPRESS` to your `DB_SERVER` if using SQL Server Express

**Problem: "Port 5000 is already in use"**

Solution:
- Change `PORT=5000` to `PORT=5001` in your `.env` file
- Restart the backend server

**Problem: "JWT_SECRET is not defined"**

Solution:
- Run `npm run generate-jwt` in the backend folder
- Copy the generated line into your `.env` file

**Problem: ".env file not found"**

Solution:
- Make sure you copied `.env.example` to `.env`
- The `.env` file should be in the `backend` folder

---

### Frontend Issues

**Problem: "Cannot connect to backend" or "Network Error"**

Solutions:
- Make sure the backend is running (check Terminal 1)
- Verify the backend shows "Server running on port 5000"
- Check that `CORS_ORIGIN=http://localhost:5173` in backend `.env`

**Problem: "Module not found" errors**

Solution:
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

**Problem: Frontend won't start on port 5173**

Solution:
- Another application might be using that port
- The error message will suggest an alternative port (e.g., 5174)
- Use that port instead: `http://localhost:5174`

---

### Database Issues

**Problem: "Invalid object name" or "Table does not exist"**

Solution:
- The database schema wasn't loaded properly
- Re-run the `ums_db.sql` script in SSMS
- Make sure you selected the `ums_db` database before running the script

**Problem: "Login failed for user 'sa'"**

Solutions:
1. Check SQL Server allows SQL Server Authentication:
   - Open SSMS
   - Right-click your server → Properties
   - Go to Security
   - Select "SQL Server and Windows Authentication mode"
   - Restart SQL Server

2. Verify your password is correct in the `.env` file

**Problem: "Cannot connect to SQL Server"**

Solutions:
1. Make sure SQL Server is running:
   - Open "Services" in Windows
   - Find "SQL Server (MSSQLSERVER)" or "SQL Server (SQLEXPRESS)"
   - Make sure it's "Running"

2. Enable TCP/IP:
   - Open "SQL Server Configuration Manager"
   - Go to SQL Server Network Configuration → Protocols
   - Enable "TCP/IP"
   - Restart SQL Server

---

### Other Common Issues

**Problem: Changes to backend code don't appear**

Solution:
- Stop the backend (Ctrl+C)
- Start it again with `npm run dev`

**Problem: Changes to frontend code don't appear**

Solution:
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache

**Problem: "Access Denied" or authentication errors**

Solution:
- Clear your browser's local storage
- Log out and log back in
- Check the JWT_SECRET hasn't changed in `.env`

---

## 📞 Need Help?

If you encounter issues not covered here:

1. Check that all prerequisites are installed correctly
2. Make sure you followed each step in order
3. Verify both backend and frontend are running simultaneously
4. Check the terminal outputs for specific error messages
5. Review the configuration in your `.env` file
