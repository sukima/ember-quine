import Helper from '@ember/component/helper';

export function pluralize([noun], { count = 1 }) {
  return count === 1 ? noun : `${noun}s`;
}

export default Helper.helper(pluralize);
