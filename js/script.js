var move = 1;

function twoDigits(newFirstDigit, newSecondDigit, flag) {
	if (newSecondDigit > 9 || newSecondDigit - newFirstDigit > 3) {
        newFirstDigit++;
		newSecondDigit = newFirstDigit + 1;
		if (newSecondDigit > 8) {
			newSecondDigit = 2;
			newFirstDigit = 1;
		}
	}
	if (flag) return newFirstDigit.toString() + newSecondDigit.toString();
	return newSecondDigit.toString() + newFirstDigit.toString();
}

function download(strData, strFileName, strMimeType) {
    var D = document,
        A = arguments,
        a = D.createElement("a"),
        d = A[0],
        n = A[1],
        t = A[2] || "text/plain";

    //build download link:
    a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);

    if (window.MSBlobBuilder) { // IE10
        var bb = new MSBlobBuilder();
        bb.append(strData);
        return navigator.msSaveBlob(bb, strFileName);
    } /* end if(window.MSBlobBuilder) */

    if ('download' in a) { //FF20, CH19
        a.setAttribute("download", n);
        //a.innerHTML = "downloading...";
        D.body.appendChild(a);
        setTimeout(function() {
            var e = D.createEvent("MouseEvents");
            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(e);
            D.body.removeChild(a);
        }, 66);
        return true;
    }; /* end if('download' in a) */

    //do iframe dataURL download: (older W3)
    var f = D.createElement("iframe");
    D.body.appendChild(f);
    f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
    setTimeout(function() {
        D.body.removeChild(f);
    }, 333);
    return true;
}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                return allText;
            }
        }
    }
    rawFile.send(null);
}

  function readSingleFile(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0]; 

    if (f) {
      var r = new FileReader();
      r.onload = function(e) { 
	      var contents = e.target.result;
		  $('#container').html(contents);
//        alert( "Got the file.n" 
//              +"name: " + f.name + "n"
//              +"type: " + f.type + "n"
//              +"size: " + f.size + " bytesn"
//              + "starts with: " + contents.substr(1, contents.indexOf("n"))
//        );  
      }
      r.readAsText(f);
    } else { 
      alert("Failed to load file");
    }
  }
  
$(document).ready(function() {
    document.getElementById('fileinput').addEventListener('change', readSingleFile, false);

	$(document).on('mouseup', '.gregorian > div', function(e) {
      if (e.which == 1) {
		if ($(this).hasClass('active')) {
			greg = $(this).html();
			digit = greg.substring(0,1);
			if (digit >= '0' && digit <= '9') {
				second = greg.substring(1,2);
				if (second >= '0' && second <= '9') {
					second = greg.substring(2,3);
				}
				
				switch(second) {
					case 'd':
					    if (digit == '2') newDigit = '5';
						if (digit == '5') newDigit = '7';
						if (digit == '7') newDigit = '2';
				        $(this).html(newDigit+second);
					    break;
					
					case 'f':
						if (digit == '5') newDigit = '7';
						if (digit == '7') newDigit = '5';
				        $(this).html(newDigit+second);
					    break;
					
					case 'P':
					    secondDigit = greg.substring(1,2);
						newSecondDigit = parseInt(secondDigit) + 1;
						newFirstDigit = parseInt(digit);
				        $(this).html(twoDigits(newFirstDigit, newSecondDigit, 1) + second);
					    break;
						
					case 'C':
					    secondDigit = greg.substring(1,2);
						newFirstDigit = parseInt(digit) + 1;
						newSecondDigit = parseInt(secondDigit);
				        $(this).html(twoDigits(newSecondDigit, newFirstDigit, 0) + second);
					    break;
						
					case 'h':
					case 'H':
					case 'I':
					case 'i':
   				        digit = parseInt(digit) + 1;
				        if (digit == 10) {
					        digit = 0;
				        }
				        $(this).html(digit.toString()+greg.substring(1,2)+second);
					    break;
						
					case 'X':
					case 'x':
					case 'R':
					    secondDigit = greg.substring(1,2);
						if (digit > secondDigit) {
							if (secondDigit == '8') {
                                $(this).html(twoDigits(1, 2, 1) + second);								
							} else {
						        newFirstDigit = parseInt(digit) + 1;
						        newSecondDigit = parseInt(secondDigit);
                                $(this).html(twoDigits(newSecondDigit, newFirstDigit, 0) + second);
							}
						} else {
							if (digit == '8') {
                                $(this).html(twoDigits(2, 1, 0) + second);								
							} else {
						        newFirstDigit = parseInt(secondDigit) + 1;
						        newSecondDigit = parseInt(digit);
                                $(this).html(twoDigits(newFirstDigit, newSecondDigit, 1) + second);
							}							
						}
					    break;
						
					default:
   				        digit = parseInt(digit) + 1;
				        if (digit == 10) {
					        digit = 0;
				        }
				        //console.log(digit+greg.substring(1));
				        $(this).html(digit.toString()+greg.substring(1));
				}

			}
		} else {
		    $('.gregorian > div').removeClass('active');
		    $(this).addClass('active');
		}
	 }
	 if (e.which == 3) {
		$(this).remove();
	 }
	});
	
	$('#addElement').on('click', function() {
	    $('#addContainer').slideToggle();
	});

	$('#moveLeft').on('click', function() {
		move--;
		if (move === -1) {
			move = 0;
		}
	    $('#addContainer').css('margin-left', 32 + (move * 512) + 'px');
	});

	$('#moveRight').on('click', function() {
		move++;
		if (move === 3) {
			move = 2;
		}
	    $('#addContainer').css('margin-left', 32 + (move * 512) + 'px');
	});

	$(document).on('click', '#addContainer > div', function() {
		html = $(this).html();
		last = html.substring(-1);
		if (last == 'h' || last == 'H' || last == 'I' || last == 'i') {
			old = $('.gregorian > div.active').html();
			if (old.length == 2) {
			    $('.gregorian > div.active').html(old + last);
			}
		} else {
		    greg = '<div>'+html+'</div>';
		    $('.gregorian > div.active').after(greg);
		    next = $('.gregorian > div.active').next();
		    $('.gregorian > div').removeClass('active');
		    next.addClass('active');
		}
	});
	
	$('#save').on('click', function() {
		download($('#container').html(), $('#saveName').val()+'.txt');
	});
	
	$('#read').on('click', function() {
		//var txt = readTextFile('file:///Downloads/'+$('#readName').val()+'.txt');
		//$('#container').html(txt);
	});
	
	$('#print').on('click', function() {
		$('.gregorian > div').removeClass('active');
		$('#container').printArea();
	});
	
	$('#addNote').on('click', function() {
		$('#container div:last').after('<div class="gregorian"><div>=</div></div><div class="description"><input type="text" class="text"></div>');
	});
});
