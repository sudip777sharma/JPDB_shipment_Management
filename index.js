var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";
var smfDBName = "DELIVERY-DB"
var smfRelationName = "SHIPMENT-TABLE"
var connToken = "90932962|-31949275433630880|90947835"

$('#shipmentNo').focus();

function resetForm() {
    $('#shipmentNo').val('');
    $('#shippingDesc').val('');
    $('#shippingSrc').val('');
    $('#shippingDest').val('');
    $('#shippingDate').val('');
    $('#shippingExpDelDate').val('');
    $('#shipmentNo').prop('disabled', false);
    $('#save').prop('disabled', true);
    $('#update').prop('disabled', true);
    $('#reset').prop('disabled', true);
    $('#shipmentNo').focus();
}

function validateData() {
    var shipmentNo, shippingDesc, shippingSrc, shippingDest, shippingDate, shippingExpDelDate;
    shipmentNo = $('#shipmentNo').val();
    shippingDesc = $('#shippingDesc').val();
    shippingSrc = $('#shippingSrc').val();
    shippingDest = $('#shippingDest').val();
    shippingDate = $('#shippingDate').val();
    shippingExpDelDate = $('#shippingExpDelDate').val();

    if (shipmentNo === '' || shippingDesc === '' || shippingSrc === '' || shippingDest === '' || shippingDate === '' || shippingExpDelDate === '') {
        alert('Please fill all the fields');
        return '';
    }
    var jsonStrObj = {
        shipmentNo: shipmentNo,
        shippingDesc: shippingDesc,
        shippingSrc: shippingSrc,
        shippingDest: shippingDest,
        shippingDate: shippingDate,
        shippingExpDelDate: shippingExpDelDate,
    };
    return JSON.stringify(jsonStrObj);
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === '') {
        return '';
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, smfDBName, smfRelationName);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
    $('#shipmentNo').focus();
}

function updateData() {
    $('#shipmentNo').prop('disabled', true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, smfDBName, smfRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    resetForm();
    $('#shipmentNo').focus();
}

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getshipmentNoAsJsonObj() {
    var shipmentNo = $('#shipmentNo').val();
    var jsonStrObj = {
        shipmentNo: shipmentNo
    };
    return JSON.stringify(jsonStrObj);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#shippingDesc').val(record.shippingDesc);
    $('#shippingSrc').val(record.shippingSrc);
    $('#shippingDest').val(record.shippingDest);
    $('#shippingDate').val(record.shippingDate);
    $('#shippingExpDelDate').val(record.shippingExpDelDate);
}

function getShipmentDetail() {
    var shipmentNoJsonObj = getshipmentNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, smfDBName, smfRelationName, shipmentNoJsonObj);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });
    if (resJsonObj.status === 400) {
        $("#save").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $("#shippingDesc").focus();
    } else if (resJsonObj.status === 200) {
        $('shipmentNo').prop('disabled', true);
        fillData(resJsonObj);

        $('#update').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#shippingDesc').focus();
    }
}