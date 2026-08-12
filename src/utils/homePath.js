export const homePathFor = (user) => {
  if (!user) return '/login'
  if (user.role === 'admin') return '/admin'
  if (user.role === 'company') return '/company/dashboard'
  return '/jobseeker/dashboard'
}
