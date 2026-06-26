/**
 * currentUser.js
 * ---------------
 * TEMPORARY mock of a "signed-in" user, used only so we can test
 * comment add/edit/delete before real authentication exists.
 * Will be removed once Redux auth state (real logged-in user) is wired up.
 */
export const mockCurrentUser = {
  userId: 'user03',
  username: 'You',
}