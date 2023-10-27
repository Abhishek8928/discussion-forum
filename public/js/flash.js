

console.log("app.js is connected");



let msg = document.querySelector(".msg");
if (msg) {
    setInterval(function () {
        msg.classList.add("d-none")
    },3000)
}


let img = document.querySelectorAll(".select-avatar > img");
let avatar = document.querySelector("#avatar");
let current = img[0];
for (let i of img) {
    i.addEventListener("click", function () {
        if (current != this) {
            avatar.value = this.src;
            this.classList.add("selected-ava");
            current.classList.remove("selected-ava")
        }
        current = this;
    })
}

