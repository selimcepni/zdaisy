sap.ui.define (
  [
    'sap/ui/core/format/DateFormat',
    'sap/ui/core/ValueState',
    'sap/m/GroupHeaderListItem',
  ],
  function (DateFormat, ValueState, GroupHeaderListItem) {
    'use strict';
    return {
      /**
       * Rounds the number unit value to 2 digits
       * @public
       * @param {string} sValue the number string to be rounded
       * @returns {string} sValue with 2 digits rounded
       */
      numberUnit: function (sValue) {
        if (!sValue) {
          return '';
        }
        return parseFloat (sValue).toFixed (2);
      },
      formatCurrencyState: function (value) {
        if (!value || isNaN (value)) {
          // Geçersiz veya sayı değilse, varsayılan olarak "error" döndür
          return 'Warning';
        }

        if (parseFloat (value) >= 0) {
          return 'Success';
        } else {
          return 'Error';
        }
      },

      formatDate: function (dates) {
        if (dates) {
          var oDateFormat = DateFormat.getDateInstance ({
            pattern: 'dd.MM.YYYY',
          });
          var oDate = new Date (dates);
          var oYear = oDate.getFullYear ();

          var thresholdYear = '2050';

          if (oYear > thresholdYear) {
            return '∞';
          } else return oDateFormat.format (oDate);
        }
      },

      stringToInteger: function (sValue) {
        try {
          // Sadece rakamsal ifadeleri işle
          if (/^\d+$/.test (sValue)) {
            // Integer'a dönüştür
            var iValue = parseInt (sValue, 10);
            return iValue;
          } else {
            // Eğer string bir sayı değilse, değeri olduğu gibi döndür
            return sValue;
          }
        } catch (e) {
          // Hata durumunda burada gerekli işlemleri yapabilirsiniz
          console.error ('Hata: Değer formatı işlenemiyor!');
          return null;
        }
      },

      avatarName: function (inputString) {
        if (inputString) {
          const words = inputString.trim ().split (' ');
          const firstAndLastLetters = words.length > 1
            ? [words[0].charAt (0), words[words.length - 1].charAt (0)]
            : [words[0].charAt (0)];

          if (firstAndLastLetters) {
            const transformedLetters = firstAndLastLetters.map (letter => {
              switch (letter) {
                case 'Ğ':
                  return 'G';
                case 'Ü':
                  return 'U';
                case 'Ş':
                  return 'S';
                case 'İ':
                  return 'I';
                case 'Ö':
                  return 'O';
                case 'Ç':
                  return 'C';
                default:
                  return letter;
              }
            });

            const result = transformedLetters.join ('');
            return result;
          }
        }
      },
      checkStateCategory: function (input) {
        var inputString = String (input);
        var firstChar = inputString.charAt (0);

        if (firstChar === 'b') {
          return 'Success';
        } else if (firstChar === 'a') {
          return 'Error';
        } else if (firstChar === 'p') {
          return 'Warning';
        } else if (firstChar === 'j') {
          return 'Information';
        } else {
          return 'None';
        }
      },
      checkStateCategoryAbsences: function (input) {
        var inputString = String (input);
        var firstChar = inputString.charAt (0);

        if (firstChar === 'Y') {
          return 'Success';
        } else if (firstChar === 'İ') {
          return 'Error';
        } else if (firstChar === 'U') {
          return 'Warning';
        } else if (firstChar === 'Ü') {
          return 'Information';
        } else {
          return 'None';
        }
      },
      checkStateCategoryStatus: function (input) {
        var inputString = String (input);
        var firstChar = inputString.charAt (0);

        if (firstChar === 'A') {
          return 'Success';
        } else if (firstChar === 'P') {
          return 'Error';
        } else {
          return 'None';
        }
      },
      noticeIconFormat (value) {
        var statusVal = '';

        switch (value) {
          case 'fa fa-birthday-cake':
            statusVal = '\image\cake.svg';
            return statusVal;

          case 'fa fa-heart':
            statusVal = '\image\anniversary.svg';
            return statusVal;

          case 'fa fa-id-card':
            statusVal = '\image\card.svg';
            return statusVal;

          case 'fa fa-tree':
            statusVal = '\image\permission.svg';
            return statusVal;

          case 'fa fa-suitcase':
            statusVal = '\image\suitcase.svg';
            return statusVal;

          default:
            return value;
        }
      },

      decimalToInteger (decimalNumber) {
        var integerNumber = Math.floor (decimalNumber);

        return integerNumber;
      },

      useRateAbsenceQuotos (value1, value2) {
        var rate = value1 / value2;

        return rate;
      },

      noticeStatusFormat (value) {
        var statusVal = '';

        switch (value) {
          case 'anniversary':
            statusVal = 'Yıl Dönümü';
            return statusVal;

          case 'birthday':
            statusVal = 'Doğum Günü';
            return statusVal;

          case 'juststartwork':
            statusVal = 'İşe Başlama';
            return statusVal;

          case 'permission':
            statusVal = 'İzinli';
            return statusVal;

          case 'quitfromcompany':
            statusVal = 'İşten Ayrılma';
            return statusVal;

          default:
            return value;
        }
      },
      staffStatusFormat (value) {
        var statusVal = '';

        switch (value) {
          case 'A':
            statusVal = 'Aktif';
            return statusVal;

          case 'P':
            statusVal = 'Pasif';
            return statusVal;

          default:
            return value;
        }
      },
      formatRowHighlight: function (oValue) {
        debugger;
        var inputString = String (oValue);
        var firstChar = inputString.charAt (0);

        if (firstChar === 'O') {
          return 'Success';
        } else if (firstChar === 'İ') {
          return 'Error';
        } else if (firstChar === 'E') {
          return 'Warning';
        } else if (firstChar === 'İ') {
          return 'Information';
        } else {
          return 'None';
        }
      },
      // Format category
      formatCategory (sValue) {
        switch (sValue) {
          case 'Kadın':
            return 'Kadın';
          case 'Erkek':
            return 'Erkek';
          case 'Evli':
            return 'Evli';
          case 'Bekar':
            return 'Bekar';
          default:
            return 'Unknown';
        }
      },

      // Format list group header
      formatGroupHeader (oGroup) {
        switch (oGroup.key) {
          case 'Kadın':
            return new GroupHeaderListItem ({title: 'Kadın'});
          case 'Erkek':
            return new GroupHeaderListItem ({title: 'Erkek'});
          case 'Evli':
            return new GroupHeaderListItem ({title: 'Evli'});
          case 'Bekar':
            return new GroupHeaderListItem ({title: 'Bekar'});
          default:
            return new GroupHeaderListItem ({title: 'Unknown'});
        }
      },
    };
  }
);
