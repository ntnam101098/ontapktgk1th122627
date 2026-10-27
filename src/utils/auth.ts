export const ADMIN_CREDENTIALS = {
  username: 'vvdtntbt',
  password: 'dtnt123456@'
};

const ADMIN_STORAGE_KEY = 'tin_hoc_12_admin_logged_in_v1';

export function checkIsAdminLoggedIn(): boolean {
  try {
    return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function loginAdmin(user: string, pass: string): { success: boolean; message?: string } {
  if (user.trim() === ADMIN_CREDENTIALS.username && pass === ADMIN_CREDENTIALS.password) {
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
    } catch (e) {
      console.error(e);
    }
    return { success: true };
  }
  return { 
    success: false, 
    message: 'Tên truy cập hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại.' 
  };
}

export function logoutAdmin(): void {
  try {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
}
