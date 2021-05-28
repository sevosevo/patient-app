

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
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const month = today.getMonth() - date.getMonth();
    const day = today.getDate() - date.getDate();
    if (month < 0 || (month === 0 && day < 0)) {
      age--;
    }
    return age;
  }


}
