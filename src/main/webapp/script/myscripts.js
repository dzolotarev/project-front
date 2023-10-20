function show_list(page_number) {
    $("tr:has(td)").remove();

    let url = "/rest/players?";

    let countPerPage = $('#count_1').val();

    //console.log("countPerPage = " + countPerPage)

    if (countPerPage == null) {
        countPerPage = 3;
    }

    url = url.concat("pageSize=").concat(countPerPage);
    if (page_number == null) {
        page_number = 0;
    }
    url = url.concat("&pageNumber=").concat(page_number);

    // console.log("url: " + url);

    $.get(url, function (response) {
        $.each(response, function (i, item) {
            $('<tr>').html("<td>"
                + item.id + "</td><td>"
                + item.name + "</td><td>"
                + item.title + "</td><td>"
                + item.race + "</td><td>"
                + item.profession + "</td><td>"
                + item.level + "</td><td>"
                + new Date(item.birthday).toLocaleDateString() + "</td><td>"
                + item.banned + "</td><td>"
                + "<button id='button_edit_" + item.id + "' onclick='editAcc(" + item.id + ")'>"
                + "<img src='/img/edit.png'>"
                + "</button>" + "</td><td>"
                + "<button id='button_delete_" + item.id + "' onclick='deleteAcc(" + item.id + ")'>"
                + "<img src='/img/delete.png'>"
                + "</button>" + "</td>"
            ).appendTo('#table_1');
        });
    });
    let totalCount = getTotalCount();

    let pageCount = Math.ceil(totalCount / countPerPage);

    $("button.pgn-bnt-styled").remove();
    // console.log(("pagesCount = " + pageCount))

    for (let i = 0; i < pageCount; i++) {
        let button_tag = "<button>" + (i + 1) + "</button>";
        let btn = $(button_tag)
            .attr('id', "paging_button_" + i)
            .attr('onclick', "show_list(" + i + ")")
            .addClass('pgn-bnt-styled');
        $('#paging_buttons').append(btn);
    }

    let identifier = "#paging_button_" + page_number;
    $(identifier).css('color', 'red');
}

function getTotalCount() {
    let url = "/rest/players/count";
    let res = 0;
    $.ajax({
        url: url,
        async: false,
        success: function (result) {
            res = parseInt(result);
        }
    })
    // console.log(res);
    return res;
}

function deleteAcc(id) {
    let url = "/rest/players/" + id;
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function () {
            show_list(getCurrentPage());
        }
    });
}

function editAcc(id) {
    let identifier_edit = "#button_edit_" + id;
    let identifier_delete = "#button_delete_" + id;

    $(identifier_delete).remove();

    let save_image_tag = "<img src='/img/save.png'>";
    $(identifier_edit).html(save_image_tag);

    let current_tr_element = $(identifier_edit).parent().parent();
    let children = current_tr_element.children();

    let td_name = children[1];
    td_name.innerHTML = "<input id='input_name_" + id + "' type='text' value = '" + td_name.innerHTML + "'>";

    let td_title = children[2];
    td_title.innerHTML = "<input id='input_title_" + id + "' type='text' value = '" + td_title.innerHTML + "'>";

    let td_race = children[3];
    let race_id = "#select_race_" + id;
    let race_current_value = td_race.innerHTML;

    td_race.innerHTML = getDropdownRaceHtml(id);
    $(race_id).val(race_current_value).change();

    let td_profession = children[4];
    let profession_id = "#select_profession_" + id;
    let profession_current_value = td_profession.innerHTML;

    td_profession.innerHTML = getDropdownProfessionHtml(id);
    $(profession_id).val(profession_current_value).change();

    let td_banned = children[7];
    let banned_id = "#select_banned_" + id;
    let banned_current_value = td_banned.innerHTML;

    td_banned.innerHTML = getDropdownBannedHtml(id);
    $(banned_id).val(banned_current_value).change();

    let property_save_tag = "saveAcc(" + id + ")";
    $(identifier_edit).attr('onclick', property_save_tag);
}

function createAcc() {
    let value_name = $("#input_name_new").val();
    let value_title = $("#input_title_new").val();
    let value_race = $("#input_race_new").val();
    let value_profession = $("#input_profession_new").val();
    let value_level = $("#input_level_new").val();
    let value_birthday = $("#input_birthday_new").val();
    let value_banned = $("#input_banned_new").val();

    let url = "/rest/players/"
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        async: false,
        data: JSON.stringify({
            "name": value_name,
            "title": value_title,
            "race": value_race,
            "profession": value_profession,
            "level": value_level,
            "birthday": new Date(value_birthday).getTime(),
            "banned": value_banned
        }),
        success: function () {
            $("#input_name_new").val("");
            $("#input_title_new").val("");
            $("#select_race_new").val("");
            $("#select_profession_new").val("");
            $("#select_level_new").val("");
            $("#select_birthday_new").val("");
            $("#select_banned_new").val("");
            show_list(getCurrentPage(""));
        }
    });
}

function saveAcc(id) {
    let value_name = $("#input_name_" + id).val();
    let value_title = $("#input_title_" + id).val();
    let value_race = $("#select_race_" + id).val();
    let value_profession = $("#select_profession_" + id).val();
    let value_banned = $("#select_banned_" + id).val();

    let url = "/rest/players/" + id;
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        async: false,
        data: JSON.stringify({
            "name": value_name,
            "title": value_title,
            "race": value_race,
            "profession": value_profession,
            "banned": value_banned
        }),
        success: function () {
            show_list(getCurrentPage());
        }
    });
}

function getDropdownRaceHtml(id) {
    let race_id = "select_race_" + id;
    return "<label for='race'></label>"
        + "<select id=" + race_id + " name='race'>"
        + "<option value='HUMAN'>HUMAN</option>"
        + "<option value='DWARF'>DWARF</option>"
        + "<option value='ELF'>ELF</option>"
        + "<option value='GIANT'>GIANT</option>"
        + "<option value='ORC'>ORC</option>"
        + "<option value='TROLL'>TROLL</option>"
        + "<option value='HOBBIT'>HOBBIT</option>"
        + "</select>";
}

function getDropdownProfessionHtml(id) {
    let profession_id = "select_profession_" + id;
    return "<label for='profession'></label>"
        + "<select id=" + profession_id + " name='profession'>"
        + "<option value='WARRIOR'>WARRIOR</option>"
        + "<option value='ROGUE'>ROGUE</option>"
        + "<option value='SORCERER'>SORCERER</option>"
        + "<option value='CLERIC'>CLERIC</option>"
        + "<option value='PALADIN'>PALADIN</option>"
        + "<option value='NAZGUL'>NAZGUL</option>"
        + "<option value='WARLOCK'>WARLOCK</option>"
        + "<option value='DRUID'>DRUID</option>"
        + "</select>";
}

function getDropdownBannedHtml(id) {
    let banned_id = "select_banned_" + id;
    return "<label for='banned'></label>"
        + "<select id=" + banned_id + " name='banned'>"
        + "<option value='false'>false</option>"
        + "<option value='true'>true</option>"
        + "</select>";
}

function getCurrentPage() {
    let current_page = 1;
    $('button:parent(div)').each(function () {
        if ($(this).css('color') === 'rgb(255,0,0)') {
            current_page = $(this).text();
        }
    });
    return parseInt(current_page) - 1;
}

// fetch("/rest/players")
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (products) {
//         let placeholder = document.querySelector("#table_1");
//         let out = "";
//         for (let product of products) {
//             out += `
//             <tr>
//             <td>${product.id}</td>
//             <td>${product.name}</td>
//             <td>${product.title}</td>
//             <td>${product.race}</td>
//             <td>${product.profession}</td>
//             <td>${product.level}</td>
//             <td>${new Date(product.birthday).toLocaleDateString()}</td>
//             <td>${product.banned}</td>
//             </tr>
//             `;
//         }
//         placeholder.innerHTML = out;

//     })
