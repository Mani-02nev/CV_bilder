# Testing Template Restrictions

This document outlines how to verify that the template restriction logic is working correctly.

## Prerequisites
- You should have at least one user account created.
- You should have access to the Admin Dashboard (`/admin/login`).

## Test Scenarios

### 1. Verify Free User Restrictions
1. Log in as a regular user (or sign up a new account).
2. Go to the "Create Resume" page (`/resume/create`).
3. You should see the Template Selector.
4. "Free" templates (Modern Blue, Classic Black, Minimal Gray) should be selectable.
5. "Premium" templates (Creative Purple, Executive Navy, etc.) should have a "Pro" badge.
6. **Interaction:** Click on a Premium template.
   - **Expected Result:** A toast message should appear saying "This is a Premium template. Please upgrade to Pro to use it."
   - **Expected Result:** The template should NOT be selected.
   - **Expected Result:** A "Click to Upgrade" text might appear on the card.
7. Click "Upgrade" in the toast notification. It should open WhatsApp with a pre-filled message.

### 2. Verify Pro User Access
1. Open a new browser window or Incognito tab.
2. Log in as Admin (`admin@ksresume.com` / `admin123`).
3. Go to the Admin Dashboard (`/admin/dashboard`).
4. Find the user account you are testing with.
5. Click the "Upgrade" button to set their status to **Pro**.
6. Switch back to the user's window.
7. Refresh the page (since profile data is cached for 5 minutes).
8. Go to the "Create Resume" page again.
9. **Interaction:** Click on a Premium template.
   - **Expected Result:** The template should be successfully selected.
   - **Expected Result:** no toast error message should appear.
   - **Expected Result:** The "Pro" badge might still be there (indicating it's a premium template), but the "Lock" icon/overlay should be gone.

### 3. Verify Downgrade (Pro -> Free)
1. Go back to the Admin Dashboard.
2. Click "Downgrade" for the user.
3. Switch back to the user's window and refresh.
4. Try selecting a Premium template again.
5. **Expected Result:** Selection should be blocked again.

## Troubleshooting
- If changes don't appear immediately, try refreshing the page to bypass the query cache.
- Ensure the database migration (`add_is_pro_to_profiles.sql`) was successfully applied.
