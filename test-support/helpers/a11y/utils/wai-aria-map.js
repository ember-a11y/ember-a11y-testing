// A map of all ARIA roles and their supported/required properties/states
// Reference: http://www.w3.org/TR/wai-aria/appendices#quickref
export const GLOBAL_ARIA = [
  'atomic',
  'busy',
  'controls',
  'describedby',
  'disabled',
  'dropeffect',
  'flowto',
  'grabbed',
  'haspopup',
  'hidden',
  'invalid',
  'label',
  'labelledby',
  'live',
  'owns',
  'relevant'
]

export const ARIA_MAP = {
  alert: {
    supported: [ 'expanded' ]
  },
  alertdialog: {
    supported: [ 'expanded' ]
  },
  application: {
    supported: [ 'expanded' ]
  },
  article: {
    supported: [ 'expanded' ]
  },
  banner: {
    supported: [ 'expanded' ]
  },
  button: {
    supported: [ 'expanded', 'pressed' ]
  },
  checkbox: {
    required: [ 'checked' ]
  },
  columnheader: {
    supported: [ 'sort', 'readonly', 'required', 'selected', 'expanded' ]
  },
  combobox: {
    required: [ 'expanded' ],
    supported: [ 'autocomplet', 'require', 'activedescendant' ]
  },
  complementary: {
    supported: [ 'expanded' ]
  },
  contentinfo: {
    supported: [ 'expanded' ]
  },
  definition: {
    supported: [ 'expanded' ]
  },
  dialog: {
    supported: [ 'expanded' ]
  },
  directory: {
    supported: [ 'expanded' ]
  },
  document: {
    supported: [ 'expanded' ]
  },
  form: {
    supported: [ 'expanded' ]
  },
  grid: {
    supported: [ 'level', 'multiselectable', 'readonly', 'activedescendant', 'expanded' ]
  },
  gridcell: {
    supported: ['readonly', 'required', 'selected', 'expanded' ]
  },
  group: {
    supported: [ 'activedescendant', 'expanded' ]
  },
  heading: {
    supported: [ 'level', 'expanded' ]
  },
  img: {
    supported: [ 'expanded' ]
  },
  link: {
    supported: [ 'expanded' ]
  },
  list: {
    supported: [ 'expanded' ]
  },
  listbox: {
    supported: [ 'multiselectable', 'required', 'expanded', 'activedescendant', 'expanded' ]
  },
  listitem: {
    supported: [ 'level', 'posinset', 'setsize', 'expanded' ]
  },
  log: {
    supported: [ 'expanded' ]
  },
  main: {
    supported: [ 'expanded' ]
  },
  marquee: {
    supported: [ 'expanded' ]
  },
  math: {
    supported: [ 'expanded' ]
  },
  menu: {
    supported: [ 'expanded', 'activedescendant', 'expanded' ]
  },
  menubar: {
    supported: [ 'expanded', 'activedescendant', 'expanded' ]
  },
  menuitem: {
  },
  menuitemcheckbox: {
    required: [ 'checked' ]
  },
  menuitemradio: {
    required: [ 'checked' ],
    supported: [ 'posinset', 'selected', 'setsize' ]
  },
  navigation: {
    supported: [ 'expanded' ]
  },
  note: {
    supported: [ 'expanded' ]
  },
  option: {
    supported: [ 'checked', 'posinset', 'selected', 'setsize' ]
  },
  presentation: {
  },
  progressbar: {
    supported: [ 'valuemax', 'valuemin', 'valuenow', 'valuetext' ]
  },
  radio: {
    required: [ 'checked' ],
    supported: [ 'posinset', 'selected', 'setsize' ]
  },
  radiogroup: {
    supported: [ 'required', 'activedescendant', 'expanded' ]
  },
  region: {
    supported: [ 'expanded' ]
  },
  row: {
    supported: [ 'level', 'selected', 'activedescendant', 'expanded' ]
  },
  rowgroup: {
    supported: [ 'activedescendant', 'expanded' ]
  },
  rowheader: {
    supported: [ 'sort', 'readonly', 'required', 'selected', 'expanded' ]
  },
  search: {
    supported: [ 'expanded' ]
  },
  separator: {
    supported: [ 'expanded', 'orientation' ]
  },
  scrollbar: {
    required: [ 'controls', 'orientation', 'valuemax', 'valuemin', 'valuenow' ],
    supported: [ 'valuetext' ]
  },
  slider: {
    required: [ 'valuemax', 'valuemin', 'valuenow' ],
    supported: [ 'orientation', 'valuetext' ]
  },
  spinbutton: {
    required: [ 'valuemax', 'valuemin', 'valuenow' ],
    supported: [ 'required', 'valuetext' ]
  },
  status: {
    supported: [ 'expanded' ]
  },
  tab: {
    supported: [ 'selected', 'expanded' ]
  },
  tablist: {
    supported: [ 'level', 'multiselectable', 'activedescendant', 'expanded' ]
  },
  tabpanel: {
    supported: [ 'expanded' ]
  },
  textbox: {
    supported: [ 'activedescendant', 'autocomplete', 'multiline', 'readonly', 'required' ]
  },
  timer: {
    supported: [ 'expanded' ]
  },
  toolbar: {
    supported: [ 'activedescendant', 'expanded' ]
  },
  tooltip: {
    supported: [ 'expanded' ]
  },
  tree: {
    supported: [ 'multiselectable', 'required', 'activedescendant', 'expanded' ]
  },
  treegrid: {
    supported: [ 'level', 'multiselectable', 'readonly', 'activedescendant', 'expanded', 'multiselectable', 'required', 'activedescendant', 'expanded' ]
  },
  treeitem: {
    supported: [ 'level', 'posinset', 'setsize', 'expanded', 'checked', 'posinset', 'selected', 'setsize' ]
  }
}
