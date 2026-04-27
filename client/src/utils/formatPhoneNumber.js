export function formatPhoneNumber(n){
    let digits =n.replace(/\D/g,"");
    digits=digits.slice(0,10)
                            
    let number = ""
    if (digits.length <= 3){
        number = digits
    } else if(digits.length <=6){
        number = digits.slice(0,3) + "-" +digits.slice(3)
    }else{
        number=digits.slice(0,3) + "-" +digits.slice(3,6)+"-"+digits.slice(6)
    }
    return number;
}