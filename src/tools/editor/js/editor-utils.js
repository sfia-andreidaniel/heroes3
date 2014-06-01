function $_FORM_POST(url, params, optionalTargetFrameName) {
    var frm = document.createElement('form');
    frm.setAttribute('method', 'post');
    if (typeof(optionalTargetFrameName) != 'undefined')
        frm.setAttribute('target', optionalTargetFrameName);
    frm.setAttribute('action', url);

    var name, value, input, param;

    //process params
    for (var i=0; i<params.length; i++) {

        param = params[i].toString();

        name = param.substr(0, param.indexOf('='));
        value= param.substr(name.length+1);

        name = decodeURIComponent(name);
        value= decodeURIComponent(value);

        input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name',  name);
        input.value = value;
        frm.appendChild(input);
    }

    frm.style.display = 'none';

    document.body.appendChild(frm);

    frm.submit();
    document.body.removeChild(frm);
};
