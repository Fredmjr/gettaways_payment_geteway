const mgspanlcntnts = document.querySelector("#mgspanlcntnts");
const main = document.querySelector("#main");
const home = document.querySelector("#home");

document.querySelector("#buyBtn").addEventListener("click", () => {
  const srvr_data = {
    amount: 1.0,
    phone: "260975986004",
    operator: "airtel",
  };

  //awaiting response
  const loading_icon = "Process payment...";
  main.innerHTML = loading_icon;

  //json
  fetch("/lencoapi/init", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(srvr_data),
  })
    .then((response) => response.json())
    .then((data) => {
      //
      if (data.timed_out === true) {
        main.innerHTML = data.mgs;
      }
      //
      if (data.erMgs) {
        main.innerHTML = data.erMgs;
      }
      if (data.payment_processing_sttus === true) {
        main.innerHTML = data.mgs;
        //check payment status
        const chkr_obj = {
          chkr_lnc_pymnt_id: data.chkr_lnc_pymnt_id,
          chkr_usr_pymnt_id: data.chkr_usr_pymnt_id,
        };
        fetch("/lencoapi/ckrpymnt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chkr_obj),
        })
          .then((response) => response.json())
          .then((data) => {
            //for complated (paid status) payment
            const pymntCard = (obj) => {
              const div = document.createElement("div");
              div.innerHTML = `
                <p>${obj.mgs}</p>
                <p>${obj.pymnt_details_operator}</p>
                <p>${obj.pymnt_details_name}</p>
                <p>${obj.pymnt_details_amount}</p>
                <p>${obj.pymnt_details_currency}</p>
                <p>${obj.pymnt_details_type}</p>
                <p>${obj.pymnt_details_date}</p>
                <br><br>
                <button id="chkrpymnt8pg_rtrnhmBtn">return home</button>
              `;
              div.className = "paid_crd";
              return div;
            };

            const handle_paid = (data) => {
              main.appendChild(pymntCard(data));
            };

            const run_check = (url, delay, next_check) => {
              setTimeout(() => {
                console.log(`${delay / 1000} secs`);
                fetch(url, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(chkr_obj),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.erMgs === false) {
                      main.innerHTML = data.erMgs;
                    }
                    if (
                      data.payment_paid_sttus === false ||
                      data.last_payment_paid_sttus === false
                    ) {
                      main.innerHTML = data.mgs;
                      if (next_check) {
                        next_check();
                      }
                    }
                    if (data.payment_paid_sttus === true) {
                      handle_paid(data);
                    }
                  })
                  .catch((error) => console.error(error));
              }, delay);
            };

            if (data.erMgs) {
              main.innerHTML = data.erMgs;
            }

            if (data.payment_paid_sttus === false) {
              run_check("/lencoapi/reckrpymnt", 10000, () => {
                run_check("/lencoapi/lastreckrpymnt", 20000);
              });
            }

            if (data.payment_paid_sttus === true) {
              handle_paid(data);
            }
          })
          .catch((error) => console.error(error));
      }
    })
    .catch((error) => console.error(error));
});

//mutation oberserver
const appbsrvr = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      const el1 = node.matches?.("#faildpymntpg_rtrnhmBtn")
        ? node
        : node.querySelector?.("#faildpymntpg_rtrnhmBtn");

      const el2 = node.matches?.("#faildpymntpg_cstmrspprtBtn")
        ? node
        : node.querySelector?.("#faildpymntpg_cstmrspprtBtn");

      //return home from failed payment page
      if (el1) {
        el1.addEventListener("click", () => {
          window.location.reload();
        });
      }
      //customer support
      if (el2) {
        el2.addEventListener("click", () => {
          main.innerHTML = "customer support section";
        });
      }
    });
  });
});
appbsrvr.observe(home, { childList: true, subtree: true });
/* document.body.addEventListener("click", (event) => {
  if (
    event.target.matches("#esbmnulrtrnhmpgBtn") ||
    event.target.closest("#esbmnulrtrnhmpgBtn")
  ) {
    window.location.href = "/";
  }
}); */
