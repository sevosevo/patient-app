

export enum TimeFormat {
  MM_DD_YYYY = 'MM_DD_YYYY',
}

export class GetTimeUtility {

  static get(date: Date, format: TimeFormat): string {
      let month = '' + (date.getMonth() + 1);
      let day = '' + date.getDate();
      const year = String(date.getFullYear());

      if (month.length < 2) {
        month = '0' + month;
      }

      if (day.length < 2) {
        day = '0' + day;
      }

      let dateArr: string[];

      switch (format) {
        case TimeFormat.MM_DD_YYYY:
          dateArr = [month, day, year];
          break;
        default:
          dateArr =  [year, month, day];
      }

      return dateArr.join('-');
  }


  static calculateAge(date: Date): number {
    const ageDif = Date.now() - date.getTime();
    const ageDate = new Date(ageDif);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }


}
