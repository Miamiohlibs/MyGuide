const spanish = require('./sample-data/subjectsAfterFavsAdded/Spanish.json');
const german = require('./sample-data/subjectsAfterFavsAdded/German.json');

const UserLibGuidesData = require('../UserLibGuidesData');

describe('UserLibGuidesData: separateTopAndFavDatabases', () => {
  describe('separateTopAndFavDatabases: Spanish', () => {
    const obj = new UserLibGuidesData();

    it('should get a response with databases: [aboveFold, belowFold]', () => {
      // Note: `structuredClone` is used to avoid mutating the original data.
      const result = obj.separateTopAndFavDatabases(structuredClone(spanish));
      expect(result).toHaveProperty('databases');
      expect(result.databases).toHaveProperty('aboveFold');
      expect(result.databases).toHaveProperty('belowFold');
    });

    it('should get 5 above/3 below', () => {
      const result = obj.separateTopAndFavDatabases(structuredClone(spanish));
      expect(Array.isArray(result.databases.aboveFold)).toBe(true);
      expect(Array.isArray(result.databases.belowFold)).toBe(true);
      expect(result.databases.aboveFold.length).toBe(5);
      expect(result.databases.belowFold.length).toBe(3);
    });

    it('should have expected databases in aboveFold and belowFold for Spanish', () => {
      const result = obj.separateTopAndFavDatabases(structuredClone(spanish));
      let expectedAboveFold = [
        'Clase and Periodica',
        'Film and Television Literature Index with Full Text',
        'Fuente Academica',
        'Linguistics & Language Behavior Abstracts',
        'MLA International Bibliography',
      ];
      let expectedBelowFold = [
        'Ethnic NewsWatch',
        'Latin American Women Writers',
        'Latino Literature',
      ];
      expect(
        expectedAboveFold.includes(result.databases.aboveFold[0].name)
      ).toBe(true);
      expect(
        expectedAboveFold.includes(result.databases.aboveFold[1].name)
      ).toBe(true);
      expect(
        expectedAboveFold.includes(result.databases.aboveFold[2].name)
      ).toBe(true);
      expect(
        expectedAboveFold.includes(result.databases.aboveFold[3].name)
      ).toBe(true);
      expect(
        expectedAboveFold.includes(result.databases.aboveFold[4].name)
      ).toBe(true);
      expect(
        expectedBelowFold.includes(result.databases.belowFold[0].name)
      ).toBe(true);
      expect(
        expectedBelowFold.includes(result.databases.belowFold[1].name)
      ).toBe(true);
      expect(
        expectedBelowFold.includes(result.databases.belowFold[2].name)
      ).toBe(true);
    });
  });

  describe('separateTopAndFavDatabases: German', () => {
    const obj = new UserLibGuidesData();

    it('should get a response with databases: [aboveFold, belowFold]', () => {
      const result = obj.separateTopAndFavDatabases(structuredClone(german));
      expect(result).toHaveProperty('databases');
      expect(result.databases).toHaveProperty('aboveFold');
      expect(result.databases).toHaveProperty('belowFold');
    });

    it('should get 5 above/3 below', () => {
      const result = obj.separateTopAndFavDatabases(structuredClone(german));
      expect(Array.isArray(result.databases.aboveFold)).toBe(true);
      expect(Array.isArray(result.databases.belowFold)).toBe(true);
      expect(result.databases.aboveFold.length).toBe(3);
      expect(result.databases.belowFold.length).toBe(2);
    });

    it('should have expected databases in aboveFold and belowFold for German', () => {
      const result = obj.separateTopAndFavDatabases(structuredClone(german));

      let expectedAboveFold = [
        'Film and Television Literature Index with Full Text',
        'MLA International Bibliography',
        'Linguistics & Language Behavior Abstracts',
      ];
      let expectedBelowFold = [
        'German Life and Letters',
        'Oxford Bibliographies Online: Literary and Critical Theory',
      ];
      expect(
        expectedAboveFold.includes(result.databases.aboveFold[0].name)
      ).toBe(true);
      expect(
        expectedAboveFold.includes(result.databases.aboveFold[1].name)
      ).toBe(true);
      expect(
        expectedAboveFold.includes(result.databases.aboveFold[2].name)
      ).toBe(true);
      expect(
        expectedBelowFold.includes(result.databases.belowFold[0].name)
      ).toBe(true);
      expect(
        expectedBelowFold.includes(result.databases.belowFold[1].name)
      ).toBe(true);
    });
  });
});
