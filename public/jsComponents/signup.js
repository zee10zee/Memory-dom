
const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", 
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", 
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", 
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", 
    "Congo (Democratic Republic of the Congo)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", 
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", 
    "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", 
    "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", 
    "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", 
    "Kenya", "Kiribati", "Korea (North)", "Korea (South)", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", 
    "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", 
    "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", 
    "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", 
    "Niger", "Nigeria", "North Macedonia (formerly Macedonia)", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", 
    "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", 
    "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", 
    "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", 
    "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", 
    "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", 
    "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", 
    "Vanuatu", "Vatican City (Holy See)", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const select = document.getElementById('countries')
    countries.forEach((country)=>{
        const countryElement = document.createElement('option')
        countryElement.value = country;
        countryElement.id = country
        countryElement.textContent = country

       select.appendChild(countryElement)

    })


    // date of birth setup

    const selectedYear = document.getElementById('yob')
    const selectedMonth = document.getElementById('mob')
    const selectedDay = document.getElementById('dayob')
    console.log(selectedYear, selectedMonth, selectedDay)


    // populate the month

    const months = ['jan', 'feb','Mar', 'Apr','May', 'June','July', 'Aug','Sep', 'Oct','Nov', 'Dec']
    
    for(i = 0; i < months.length; i++){
        const monthElement = document.createElement('option')
        monthElement.value = i + 1;
        monthElement.textContent = months[i];
        selectedMonth.appendChild(monthElement)
    }


    // year population

    const currentYear = new Date().getFullYear()
    const startingYear = 1900

    for(i = currentYear; i> startingYear; i--){
        const yearOption = document.createElement('option')
        yearOption.value = i;
        yearOption.textContent = i;
        selectedYear.appendChild(yearOption)
    }


    // if the year is leap year// months in these years differe
    function isLeapYear(year){
        return ((year % 4 === 0 && year % 100 !== 0) || year % 400 ===0)
    }


    //set days of the month based on the month

    function getDaysOfInMonth(month, year){
        if(!month || !year) return 31;
        if([4,6,9,11].includes(month)) return 30;
        // check if month is feb, and again check if its a leap year or not, if yes , feb is 29 days , otherwise feb is 28 days . 
        // the only variable month in the year is FEB. 
        if(month === 2){
            if(isLeapYear(year)){
                return 29
            }else{
                return 28
            }
        } 

        return 31;
    }

    // update days function

    function updateDays(){
        const monthSelected = parseInt(selectedMonth.value)
        const yearSelected = parseInt(selectedYear.value)
        console.log(monthSelected, yearSelected)
        const days = getDaysOfInMonth(monthSelected, yearSelected)
          // populate the days 
      for(i = 1; i <= days; i++){
        const option =  document.createElement('option')
        option.value = i;
        option.textContent =  i;
        selectedDay.appendChild(option)
    }
    console.log(days)

    }

    // document.querySelectorAll('input[type="radio"]').forEach((radio)=>{
    //     radio.addEventListener('change', (e)=>{
    //         if(e.target.value === "male"){
    //             console.log('male')
    //         }else if(e.target.value ==="other"){
    //             console.log('hibrid')
    //         }else{
    //             console.log('check maybe female')
    //         }
    //     })
    // })
    
     

     
    selectedYear.addEventListener('change', updateDays)
    selectedMonth.addEventListener('change', updateDays)









