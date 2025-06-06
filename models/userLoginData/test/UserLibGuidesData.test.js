const spanish = require('./sample-data/subjectsAfterFavsAdded/Spanish.json');
const german = require('./sample-data/subjectsAfterFavsAdded/German.json');

const UserLibGuidesData = require('../UserLibGuidesData');

describe('UserLibGuidesData: separateTopAndFavDatabases', () => {
  //   it('should test true', () => {
  //     expect(true).toBe(true);
  //   });

  //   it('should have a databases object thats an array with a filter function (spanish)', () => {
  //     expect(Array.isArray(spanish.databases)).toBe(true);
  //     expect(typeof spanish.databases.filter).toBe('function');
  //   });

  it('should get a response from separateTopAndFavDatabases(spanish)', () => {
    const obj = new UserLibGuidesData();
    const result = obj.separateTopAndFavDatabases(spanish);
    expect(result).toHaveProperty('databases');
    expect(result.databases).toHaveProperty('aboveFold');
    expect(result.databases).toHaveProperty('belowFold');
    expect(Array.isArray(result.databases.aboveFold)).toBe(true);
    expect(Array.isArray(result.databases.belowFold)).toBe(true);
    expect(result.databases.aboveFold.length).toBe(5);
    expect(result.databases.belowFold.length).toBe(3);
  });

  it('should get 3 above/2 below from separateTopAndFavDatabases(german)', () => {
    const obj = new UserLibGuidesData();
    const result = obj.separateTopAndFavDatabases(german);
    let expectedAboveFold = [
      'Film and Television Literature Index with Full Text',
      'MLA International Bibliography',
      'Linguistics & Language Behavior Abstracts',
    ];
    let expectedBelowFold = [
      'German Life and Letters',
      'Oxford Bibliographies Online: Literary and Critical Theory',
    ];
    expect(result).toHaveProperty('databases');
    expect(result.databases).toHaveProperty('aboveFold');
    expect(result.databases).toHaveProperty('belowFold');
    expect(Array.isArray(result.databases.aboveFold)).toBe(true);
    expect(Array.isArray(result.databases.belowFold)).toBe(true);
    expect(result.databases.aboveFold.length).toBe(3);
    expect(result.databases.belowFold.length).toBe(2);
    expect(expectedAboveFold.includes(result.databases.aboveFold[0].name)).toBe(
      true
    );
    expect(expectedAboveFold.includes(result.databases.aboveFold[1].name)).toBe(
      true
    );
    expect(expectedAboveFold.includes(result.databases.aboveFold[2].name)).toBe(
      true
    );
    expect(expectedBelowFold.includes(result.databases.belowFold[0].name)).toBe(
      true
    );
    expect(expectedBelowFold.includes(result.databases.belowFold[1].name)).toBe(
      true
    );
  });

  // German:
  // favs: ['Film and Television Literature Index with Full Text','MLA International Bibliography']
  // top: ['Linguistics & Language Behavior Abstracts','MLA International Bibliography']
  // others: ['German Life and Letters','Oxford Bibliographies Online: Literary and Critical Theory']

  //   it('should have aboveFold and belowFold properties for German', () => {
  //     const result = obj.separateTopAndFavDatabases(german);
  //     expect(result).toHaveProperty('databases.aboveFold');
  //     expect(result).toHaveProperty('databases.belowFold');
  //   });
  //   it('should find 3 databases aboveFold in German, 2 belowFold', () => {
  //     const result = obj.separateTopAndFavDatabases(german);
  //     let expectedAboveFold = [
  //       'Linguistics & Language Behavior Abstracts',
  //       'MLA International Bibliography',
  //       'Linguistics & Language Behavior Abstracts',
  //     ];
  //     let expectedBelowFold = [
  //       'German Life and Letters',
  //       'Oxford Bibliographies Online: Literary and Critical Theory',
  //     ];
  //     expect(result.databases.aboveFold.length).toBe(3);
  //     expect(result.databases.belowFold.length).toBe(2);
  //     expect(expectedAboveFold.includes(result.databases.aboveFold[0].name)).toBe(
  //       true
  //     );
  //     expect(expectedAboveFold.includes(result.databases.aboveFold[1].name)).toBe(
  //       true
  //     );
  //     expect(expectedAboveFold.includes(result.databases.aboveFold[2].name)).toBe(
  //       true
  //     );
  //     expect(expectedBelowFold.includes(result.databases.belowFold[0].name)).toBe(
  //       true
  //     );
  //     expect(expectedBelowFold.includes(result.databases.belowFold[1].name)).toBe(
  //       true
  //     );
  //   });

  //   // Spanish:
  //   //   favs: ["Clase and Periodica","Fuente Academica"]
  //   //   top: [
  //   //             "Film and Television Literature Index with Full Text",
  //   //             "Linguistics & Language Behavior Abstracts"
  //   //             "MLA International Bibliography"
  //   //         ]
  //   // others: ['Ethnic NewsWatch','Latin American Women Writers','Latino Literature']

  //   it('should have a databases object thats an array', () => {
  //     expect(Array.isArray(spanish.databases)).toBe(true);
  //   });
  //   it('should have a filter function on th databases array', () => {
  //     expect(typeof spanish.databases.filter).toBe('function');
  //   });
  //   it('should have aboveFold and belowFold properties for Spanish', () => {
  //     const result = obj.separateTopAndFavDatabases(spanish);
  //     expect(result).toHaveProperty('databases.aboveFold');
  //     expect(result).toHaveProperty('databases.belowFold');
  //   });

  //   it('should find 5 databases aboveFold in Spanish, 3 belowFold', () => {
  //     const result = obj.separateTopAndFavDatabases(spanish);
  //     let expectedAboveFold = [
  //       'Clase and Periodica',
  //       'Film and Television Literature Index with Full Text',
  //       'Fuente Academica',
  //       'Linguistics & Language Behavior Abstracts',
  //       'MLA International Bibliography',
  //     ];
  //     let expectedBelowFold = [
  //       'Ethnic NewsWatch',
  //       'Latin American Women Writers',
  //       'Latino Literature',
  //     ];
  //     expect(result.databases.aboveFold.length).toBe(5);
  //     expect(result.databases.belowFold.length).toBe(3);
  //     expect(expectedAboveFold.includes(result.databases.aboveFold[0].name)).toBe(
  //       true
  //     );
  //     expect(expectedAboveFold.includes(result.databases.aboveFold[1].name)).toBe(
  //       true
  //     );
  //     expect(expectedAboveFold.includes(result.databases.aboveFold[2].name)).toBe(
  //       true
  //     );
  //     expect(expectedAboveFold.includes(result.databases.aboveFold[3].name)).toBe(
  //       true
  //     );
  //     expect(expectedAboveFold.includes(result.databases.aboveFold[4].name)).toBe(
  //       true
  //     );
  //     expect(expectedBelowFold.includes(result.databases.belowFold[0].name)).toBe(
  //       true
  //     );
  //     expect(expectedBelowFold.includes(result.databases.belowFold[1].name)).toBe(
  //       true
  //     );
  //     expect(expectedBelowFold.includes(result.databases.belowFold[2].name)).toBe(
  //       true
  //     );
  //   });
});
