/** EDU 的四位界面码只用于控制当前 Newtab 的显示状态。 */
export function canUnlockEdu(pin: string): boolean {
  return pin === '0000';
}
