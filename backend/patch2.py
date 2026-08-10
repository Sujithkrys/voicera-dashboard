import sys

def main():
    # Read as bytes
    with open('app/api/v1/routes/auth.py', 'rb') as f:
        data = f.read()
    
    # Try decoding as utf-8 and ignore errors, or better, clean up the null bytes
    # Since it's ASCII text interleaved with nulls, removing nulls works.
    cleaned_data = bytes([b for b in data if b != 0])
    
    content = cleaned_data.decode('utf-8')
    
    # Replace the profile route
    import re
    matches = list(re.finditer(r'@router\.patch\(\"/profile\"\)', content))
    if not matches:
        print('Not found')
        return
        
    last_match_idx = matches[-1].start()
    password_idx = content.find('@router.patch(\"/password\")', last_match_idx)
    
    if password_idx == -1:
        print('Password route not found')
        return
        
    new_func = '''@router.patch(\"/profile\")
async def update_profile(
    request: UpdateProfileRequest, 
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user_id = current_user.get(\"user_id\") if isinstance(current_user, dict) else getattr(current_user, \"id\", None)
    current_email = current_user.get(\"email\") if isinstance(current_user, dict) else getattr(current_user, \"email\", None)
    
    # Verify password if email is being changed
    if request.email and request.email != current_email:
        if not request.current_password:
            raise HTTPException(status_code=400, detail=\"Current password is required to change email address\")
            
        pw_query = text(\"SELECT hashed_password FROM users WHERE id = :id\")
        pw_result = await db.execute(pw_query, {\"id\": user_id})
        pw_row = pw_result.fetchone()
        
        if not pw_row or not pw_row.hashed_password or not verify_password(request.current_password, pw_row.hashed_password):
            raise HTTPException(status_code=400, detail=\"Incorrect current password\")
            
    query = text(\"\"\"
        UPDATE users 
        SET full_name = COALESCE(:full_name, full_name),
            email = COALESCE(:email, email)
        WHERE id = :id
        RETURNING id, email, full_name
    \"\"\")
    result = await db.execute(query, {
        \"full_name\": request.full_name,
        \"email\": request.email,
        \"id\": user_id
    })
    await db.commit()
    
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail=\"User not found\")
        
    return {\"success\": True, \"message\": \"Profile updated\", \"user\": dict(row._mapping)}

'''
    
    new_content = content[:last_match_idx] + new_func + content[password_idx:]
    with open('app/api/v1/routes/auth.py', 'w', encoding='utf-8', newline='\n') as f:
        f.write(new_content)
    print('Updated successfully')

main()
