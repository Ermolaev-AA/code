// Webflow Forms++
// dev. Anton Ermolaev (@ermolaev_anton)
// 
// What this framework can do?
// 1. The framework does not affect or conflict with Webflow libraries!
// 2. The framework сreates additional spam protection from bots
// 3. The framework complements classic webhooks: urls, cookies, utm
//
// Documentation:
//
//

console.log("test");

const domain = new URL(window.location.href).hostname;
const page = window.location.pathname.split('/').pop();

const container = document.querySelector('[ae-forms-plus="container"]');
const redirect = container.getAttribute('redirect-page');
const redirectUTM = container.getAttribute('redirect-utm');

const verification = document.querySelector('[ae-forms-plus="container"] [ae-forms-plus="verification"]');
const submit = document.querySelector('[ae-forms-plus="container"] [ae-forms-plus="submit"]');
const success = document.querySelector('[ae-forms-plus="success"]');

const field__name = document.querySelector('[ae-forms-plus="container"] [field="name"]');
const field__phone = document.querySelector('[ae-forms-plus="container"] [field="phone"]');



// Phone Mask
if (field__phone.hasAttribute('mask') === true) {
    const country = field__phone.getAttribute('mask');
    if (country == 'ru') {
        $.mask.definitions['9'] = false;
        $.mask.definitions['0'] = "[0-9]";
        $('[ae-forms-plus="container"] [field="phone"]')
            .mask("+7 000 000 00 00", {placeholder: "" }, {autoclear: true});
    } else {
        console.log('I do not know such a mask!');
    }

    console.log('The attribute exists') // Debugging
}

// Verification
verification.addEventListener('click', function() {
    if (field__name.value === "" || field__phone.value === "") {
        submit.click();

        // console.log('Fulfill the required conditions!'); // Debugging
    } else {
        document.querySelector('[metrix-field="bot"]').value = "false"
        submit.click();
    
        // Создаем функцию обратного вызова для Mutation Observer
        const mutationCallback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    // Если произошло изменение атрибутов в контейнере
                    window.location.href = `https://${domain}/${redirect}?${redirectUTM}=${page}`;
                }
            }
        };
        
        // Создаем экземпляр Mutation Observer с функцией обратного вызова
        const observer = new MutationObserver(mutationCallback);
        
        // Начинаем отслеживание изменений в контейнере
        observer.observe(success, { attributes: true });

        // console.log('Successful verification!'); // Debugging
    }

    // console.log('Verification has finished...'); // Debugging
});

// Metrix Field
function metrixField() {
    const url = window.location.href
    const cookie = document.cookie
    const utmArray = utmsToArray(url);
    const cookieArray = cookiesToArray(cookie);

    container.insertAdjacentHTML('afterbegin', `
        <!-- Metrix Field -->
        <div metrix="container"></div>
    `);

    const metrixContainer = document.querySelector('[ae-forms-plus="container"] [metrix="container"]');
    metrixContainer.insertAdjacentHTML('afterbegin', `
        <input type="hidden" metrix-field="url" name="url">
        <input type="hidden" metrix-field="domain" name="domain">
        <input type="hidden" metrix-field="page" name="page">
        <input type="hidden" metrix-field="cookie" name="cookie">
        <input type="hidden" metrix-field="bot" name="bot">
    `);

    document.querySelector('[metrix-field="url"]').value = url
    document.querySelector('[metrix-field="domain"]').value = new URL(url).hostname;
    document.querySelector('[metrix-field="page"]').value = page
    document.querySelector('[metrix-field="cookie"]').value = cookie
    document.querySelector('[metrix-field="bot"]').value = "true" // Default value
    
    for (let i = 0; i < utmArray.length; i++) {
        const utm = utmArray[i];
        metrixContainer.insertAdjacentHTML('beforeend', `
            <!-- UTM: ${utm.name}=${utm.value} -->
            <input type="hidden" metrix-field="${utm.name}" name="${utm.name}">
        `);

        document.querySelector(`[metrix-field="${utm.name}"]`).value = `${utm.value}`
    }

    for (let i = 0; i < cookieArray.length; i++) {
        const cookie = cookieArray[i];
        metrixContainer.insertAdjacentHTML('beforeend', `
            <!-- Cookie: ${cookie.name}=${cookie.value} -->
            <input type="hidden" metrix-field="${cookie.name}" name="cookie: ${cookie.name}">
        `);

        document.querySelector(`[metrix-field="${cookie.name}"]`).value = `${cookie.value}`
    }

    // hidden
    // visible

    // console.log(metrixContainer); // Debugging
    // console.log(utmArray); // Debugging
    // console.log(cookieArray); // Debugging
}



// Parsing UTM and creating an array
function utmsToArray(url) {
    const utmParams = [];
    const regex = /[?&]([^=]+)=([^&]*)/g;
    let match;
  
    while ((match = regex.exec(url)) !== null) {
        const param = {
            name: match[1],
            value: decodeURIComponent(match[2])
        };
        utmParams.push(param);
    }
  
    return utmParams;
}

// Parsing Cookie and creating an array
function cookiesToArray(cookie) {
    const cookies = cookie.split('; ');
    const cookieArray = [];
  
    for (const cookie of cookies) {
      const [name, value] = cookie.split('=');
      const cookieObj = {
        name: name,
        value: decodeURIComponent(value)
      };
      cookieArray.push(cookieObj);
    }
  
    return cookieArray;
}



  




metrixField();

// console.log(domain) // Debugging
// console.log(page) // Debugging

// console.log(container); // Debugging
// console.log(redirect) // Debugging
// console.log(redirectUTM) // Debugging

// console.log(verification); // Debugging
// console.log(submit); // Debugging

// console.log(field__name); // Debugging
// console.log(field__phone); // Debugging
