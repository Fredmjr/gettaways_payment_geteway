pymntsrchBtn.addEventListener("click", () => {
  const a = document.querySelector("#pymntsrchinput").value;
  const b = document.querySelector("#rsltpanel");
  const rslt_obj = {
    a: a,
  };

  fetch("/lencoapi/paymntrslt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rslt_obj),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      b.innerHTML = "";
      //errs
      if (data.erMgs) {
        b.innerHTML = data.erMgs;
      }
      //not found
      if (data.pymnt_found === false) {
        b.innerHTML = data.mgs;
      }
      //found
      if (data.pymnt_found === true) {
        const c = data.pymnt_details;
        b.innerHTML = "";

        const div = document.createElement("div");
        //recipt temp
        /*         div.innerHTML = `
                <p>${data.pymnt_mgs}</p>
                <br>
                <p>Account Holder Name: ${c.nm}</p>        
                <p>Phone No.: ${c.phone}</p>
                <p>Amount: ${c.amnt}</p>
                <p>Currency: ${c.crrncy}</p>
                <p>Payment Status: ${c.status}</p>
                <p>Payment Type: ${c.type}</p>
                <p>Payment Ticket ID (PT ID): ${c.payment_ticket_id}</p>
                <p>Payment Receipt: ${c.ticket_receipt}</p>                
                <br>                
                <p>Payment Ticket ID (PT ID): ${data.pymnt_end_note}</p>
              `; */

        //search temp
        div.innerHTML = `
                <p>${data.pymnt_mgs}</p>
                <br>
                <p>Account Holder Name: ${c.nm}</p>        
                <p>Phone No.: ${c.phone}</p>
                <p>Amount: ${c.amnt}</p>
                <p>Currency: ${c.crrncy}</p>
                <p>Payment Status: ${c.status}</p>
                <p>Payment Type: ${c.type}</p>
                <p>Payment Ticket ID (PT ID): ${c.payment_ticket_id}</p>
                <p>Payment Receipt: ${c.ticket_receipt}</p>                
              `;
        div.className = "rsltpymnt_crd";
        b.appendChild(div);
      }
    })
    .catch((error) => console.error(error));
});
