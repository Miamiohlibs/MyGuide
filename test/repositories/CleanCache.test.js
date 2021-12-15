const librarians = require('./sample-data/libapps/libn-sample.js');
const CleanCache = require('../../repositories/CleanCache.js');
const clean = new CleanCache(librarians);

const widget1 =
  '<button id="mysched_123">Schedule Me</button><style>#mysched_123 { font-weight: bold }</style><style>.other { font-weight: normal }</style>';
const added1 =
  '<button id="mysched_123" class="mysched">Schedule Me</button><style>#mysched_123 { font-weight: bold }</style><style>.other { font-weight: normal }</style>';
const removed1 =
  '<button id="mysched_123">Schedule Me</button><style>.other { font-weight: normal }</style>';
const finished1 =
  '<button id="mysched_123" class="mysched">Schedule Me</button><style>.other { font-weight: normal }</style>';
const unrelatedWidget =
  '<button class="nyob">Ignore the Man Behind the Curtain</button><style>.nyob { font-weight: bold; }</style>';
const widget2 =
  '<button id="mySched31734" href="#">Schedule Appointment</button> <!-- Below is optional button styling  //--> <style> #mySched31734 {   background: #2e8093;   border: 1px solid #FFFFFF;   border-radius: 4px;   color: #FFFFFF;   font: 16px Arial, Helvetica, Verdana;   padding: 6px 16px;   cursor: pointer; } #mySched31734:hover {   opacity: 0.9; } </style>';
const added2 =
  '<button id="mySched31734" href="#" class="mysched">Schedule Appointment</button> <!-- Below is optional button styling  //--> <style> #mySched31734 {   background: #2e8093;   border: 1px solid #FFFFFF;   border-radius: 4px;   color: #FFFFFF;   font: 16px Arial, Helvetica, Verdana;   padding: 6px 16px;   cursor: pointer; } #mySched31734:hover {   opacity: 0.9; } </style>';
const removed2 =
  '<button id="mySched31734" href="#">Schedule Appointment</button> <!-- Below is optional button styling  //--> ';
const finished2 =
  '<button id="mySched31734" href="#" class="mysched">Schedule Appointment</button> <!-- Below is optional button styling  //--> ';
const blank = '';

describe('CleanCache', () => {
  it('should return an object of class CleanCache', () => {
    expect(clean instanceof CleanCache).toBe(true);
  });
  it('addScheduleClass should add class to widget1', () => {
    let res = clean.addScheduleClass(widget1);
    expect(res).toBe(added1);
  });
  it('removeScheduleStyles should add class to widget1', () => {
    let res = clean.removeScheduleStyles(widget1);
    expect(res).toBe(removed1);
  });
  it('should add class and remove styles for schedule when called together', () => {
    let res = clean.removeScheduleStyles(clean.addScheduleClass(widget1));
    expect(res).toBe(finished1);
  });
  it('addScheduleClass should return blank widget code unmodified', () => {
    let res = clean.addScheduleClass(blank);
    expect(res).toBe(blank);
  });
  it('removeScheduleStyles should return blank widget code unmodified', () => {
    let res = clean.removeScheduleStyles(blank);
    expect(res).toBe(blank);
  });
  it('addScheduleClass should return unrelated widget code unmodified', () => {
    let res = clean.addScheduleClass(unrelatedWidget);
    expect(res).toBe(unrelatedWidget);
  });
  it('removeScheduleStyles should return unrelated widget code unmodified', () => {
    let res = clean.removeScheduleStyles(unrelatedWidget);
    expect(res).toBe(unrelatedWidget);
  });
  it('addScheduleClass should be case insensitive: widget2', () => {
    let res = clean.addScheduleClass(widget2);
    expect(res).toBe(added2);
  });
  it('removeScheduleStyles should be case insensitive: widget2', () => {
    let res = clean.removeScheduleStyles(widget2);
    expect(res).toBe(removed2);
  });
  it('should add class and remove styles for schedule when called together (widget2)', () => {
    let res = clean.removeScheduleStyles(clean.addScheduleClass(widget2));
    expect(res).toBe(finished2);
  });
  it('should perform add+remove with updateWidgetCode on widget1', () => {
    let res = clean.updateWidgetCode(widget1);
    expect(res).toBe(finished1);
  });
  it('should perform add+remove with updateWidgetCode on widget2', () => {
    let res = clean.updateWidgetCode(widget2);
    expect(res).toBe(finished2);
  });
});
