import moment, { Moment } from 'moment';
import { Alert } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

class Utils {
  static trimArray = (arr: any[]) => {
    const obj: any = {};
    arr.forEach((item) => {
      obj[item['id']] = item;
    });

    const tempArr = [];
    for (const [key, value] of Object.entries(obj)) {
      tempArr.push(value);
    }
    return tempArr;
  };

  static updateObject = (oldObject: any, updatedProperties: any) => {
    return {
      ...oldObject,
      ...updatedProperties,
    };
  };

  static isNumber = (n: any) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  static currencyFormat = (value: number, decimalPlaces: number = 2) => {
    if (value) {
      return (
        '' +
        value.toFixed(decimalPlaces).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      );
    } else {
      return '0';
    }
  };

  static validateEmail = (email: any) => {
    var re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  static validatePhoneNumber = (phone: any) => {
    var re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
    return re.test(phone);
  };

  static containsUpperCase = (str: any) => {
    let i = 0;
    let character: any = '';
    while (i <= str.length) {
      character = str.charAt(i);
      if (!isNaN(character * 1)) {
      } else {
        if (
          !Utils.containsSpecialChar(character) &&
          character === character.toUpperCase()
        ) {
          return true;
        }
      }
      i++;
    }
    return false;
  };

  static containsSpecialChar = (str: any) => {
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    return format.test(str);
  };

  static checkForNumber = (str: any) => {
    const containNum = /[0-9]/;
    return containNum.test(str);
  };

  static sortByDate: (
    arr: any[],
    field: string,
    direction: 'asc' | 'desc',
  ) => any[] = (arr: any[], field, direction = 'asc') => {
    let temp = arr;
    temp = temp.sort((a, b) => {
      const dateA = new Date(a[field]);
      const dateB = new Date(b[field]);
      if (Utils.dateEquals(dateA, dateB)) {
        return 0;
      }
      if (direction == 'asc') {
        if (dateA > dateB) {
          return 1;
        } else {
          return -1;
        }
      } else {
        if (dateA < dateB) {
          return 1;
        } else {
          return -1;
        }
      }
    });
    return temp;
  };

  static dateEquals = (date1: Date, date2: Date) => {
    return (
      date1.getDay() == date2.getDay() &&
      date1.getMonth() == date2.getMonth() &&
      // @ts-ignore
      date1.getYear() == date2.getYear()
    );
  };

  static dateMonthEquals = (date1: Date, date2: Date) => {
    return (
      date1.getMonth() == date2.getMonth() &&
      // @ts-ignore
      date1.getYear() == date2.getYear()
    );
  };

  static shuffleArray = (unshuffled: any[]) => {
    let shuffled = unshuffled
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    return shuffled;
  };

  static renderCurrency = (currency: string) => {
    switch (currency) {
      case 'NGN':
        return '₦';
      case 'USD':
        return '$';
      case 'GBP':
        return '£';
      case 'EUR':
        return '€';
      default:
        return '₦';
    }
  };

  static renderNumberWord = (number: number) => {
    switch (number) {
      case 1:
        return 'One';
      case 2:
        return 'Two';
      case 3:
        return 'Three';
      case 4:
        return 'Four';
      case 5:
        return 'Five';
      case 6:
        return 'Six';
      case 7:
        return 'Seven';
      case 8:
        return 'Eight';
      case 9:
        return 'Nine';
      case 9:
        return 'Nine';
      case 0:
        return 'Zero';
      default:
        return 'Zero';
    }
  };

  static renderFrequency = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'day';
      case 'monthly':
        return 'month';
      case 'yearly':
        return 'year';
      case 'weekly':
        return 'week';
      default:
        return 'day';
    }
  };

  static handleError = (res) => {
    let message;
    if (
      res &&
      res.error &&
      res.error.errors &&
      res.error.errors.length &&
      res.error.errors.length > 0
    ) {
      message = res.error.errors[0];
    } else if (
      res &&
      res.error &&
      res.error.error &&
      res.error.error.length &&
      res.error.error.length > 0
    ) {
      message = res.error.error[0];
    } else if (
      res &&
      res.data &&
      res.data.data &&
      res.data.data.error &&
      res.data.data.error.length &&
      res.data.data.error.length > 0
    ) {
      message = res.data.data.error[0];
    } else {
      message = 'Network unavailable';
    }
    return message;
  };

  static personalSavingsPlanEquals = (plan: any, data: any) => {
    const result =
      plan['target_savings']['target_amount'] == data['target_amount'] &&
      plan['target_saving_settings']['frequency_amount'] ==
      data['frequency_amount'] &&
      plan['target_saving_settings']['frequency'] == data['frequency'] &&
      plan['target_saving_settings']['authorization']['id'] ==
      data['authorization']['id'] &&
      plan['target_saving_settings']['status'] == data['status'];
    return result;
  };
  static getReference = () => {
    var REFERENCE = moment();
    var TODAY = REFERENCE.clone().startOf('day');
    var YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');
    var A_WEEK_OLD = REFERENCE.clone().subtract(7, 'days').startOf('day');
    return {
      TODAY,
      YESTERDAY,
      A_WEEK_OLD,
    };
  };
  static isToday = (momentDate: Moment) => {
    return momentDate.isSame(Utils.getReference().TODAY, 'd');
  };
  static isYesterday = (momentDate: Moment) => {
    return momentDate.isSame(Utils.getReference().YESTERDAY, 'd');
  };
  static isWithinAWeek = (momentDate: Moment) => {
    return momentDate.isAfter(Utils.getReference().A_WEEK_OLD);
  };
  static isTwoWeeksOrMore = (momentDate: Moment) => {
    return !Utils.isWithinAWeek(momentDate);
  };

  static renderMonthDate = (date: Date) => {
    if (Utils.dateMonthEquals(date, new Date())) {
      return `This month`;
    } else if (
      Utils.dateMonthEquals(
        date,
        moment(new Date()).subtract(1, 'month').toDate(),
      )
    ) {
      return `Last month`;
    } else {
      const dateString = moment(date).format('MMMM YYYY');
      return `${dateString}`;
    }
  };

  static renderSectionHeader = (date: Date) => {
    const dateString = moment(date).format('dddd MMMM YYYY');
    if (Utils.dateEquals(date, new Date())) {
      console.log('A');
      return `Today`;
    } else if (
      Utils.dateEquals(date, moment(new Date()).subtract(1, 'day').toDate())
    ) {
      console.log('B');
      return `Yesterday`;
    } else if (Utils.isWithinAWeek(moment(date))) {
      console.log('C');
      return `This week`;
    } else {
      console.log('D');
      return `${dateString}`;
    }
  };

  static convertTransactionsToSections = (transactions: any[]) => {
    let obj: Object = {};

    transactions.forEach((trx) => {
      const tx_date_string: string = moment(
        new Date(trx['transaction_date']),
      ).format('YYYY-MM-DD');
      // @ts-ignore
      if (obj[tx_date_string]) {
        // @ts-ignore
        obj[tx_date_string].push(trx);
      } else {
        // @ts-ignore
        obj[tx_date_string] = [];
        // @ts-ignore
        obj[tx_date_string].push(trx);
      }
    });
    // console.log("Transactions", transactions, obj);
    const transactionSections: any[] = [];
    for (const key in obj) {
      // @ts-ignore
      const element = obj[key];
      transactionSections.push({
        title: key,
        data: element,
      });
    }

    return transactionSections;
  };

  static shortenText(text: string, length: number) {
    return text.length < length ? text : text.substring(0, length) + '...';
  }

  static createDate(date: Date, days: number, months: number, years: number) {
    date.setDate(date.getDate() + days);
    date.setMonth(date.getMonth() + months);
    date.setFullYear(date.getFullYear() + years);
    return date;
  }

  static isBigScreen = () => {
    let size = heightPercentageToDP(100);
    return size > 800;
  };

  static stripString = (str: string, symbol: string) => {
    const tempStringArray: string[] = []
    str.split('').forEach(v => {
      if (v !== symbol) {
        tempStringArray.push(v)
      }
    })
    return tempStringArray.join('')
  };

  static uniqueBy<A>(a: A[], key: (param: A) => string) {
    let index: any[] = [];
    return a.filter(function (item: any) {
      let k: string = key(item);
      return index.indexOf(k) >= 0 ? false : index.push(k);
    });
  }

  static compare<A>(a: A, b: A, key: string): number {
    // @ts-ignore
    if (a[key] < b[key]) {
      return -1;
    }
    // @ts-ignore
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  }

  static compareByDate<A>(a: A, b: A, key: string): number {
    // @ts-ignore
    if (new Date(a[key]) < new Date(b[key])) {
      return -1;
    }
    // @ts-ignore
    if (new Date(a[key]) > new Date(b[key])) {
      return 1;
    }
    return 0;
  }

  static calculateRate = (a: number, b: number, c: number) => a * (b * c)
}

export default Utils;
