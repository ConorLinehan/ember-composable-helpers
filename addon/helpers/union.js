import Ember from 'ember';

const {
  A: emberArray,
  Helper,
  computed: { union },
  defineProperty,
  get,
  guidFor,
  isEmpty,
  observer,
  set
} = Ember;

const idForArray = (array) => `__array-${guidFor(array)}`;

export default Helper.extend({
  compute([...arrays]) {
    set(this, 'arrays', arrays);

    return get(this, 'content');
  },

  arraysDidChange: observer('arrays.[]', function() {
    let arrays = get(this, 'arrays');

    let oldArrayKeys = get(this, 'arrayKeys') || [];
    let newArrayKeys = arrays.map(idForArray);

    let keysToRemove = oldArrayKeys.filter((key) => {
      return newArrayKeys.indexOf(key) === -1;
    });

    keysToRemove.forEach((key) => set(this, key, null));
    arrays.forEach((array) => set(this, idForArray(array), emberArray(array)));

    set(this, 'arrayKeys', newArrayKeys);

    if (isEmpty(arrays)) {
      defineProperty(this, 'content', []);
      return;
    }

    defineProperty(this, 'content', union(...newArrayKeys));
  }),

  contentDidChange: observer('content.[]', function() {
    this.recompute();
  })
});
