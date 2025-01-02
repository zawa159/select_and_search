// backgroundとの通信
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("[search_shortcut]content_scripts 読み込み確認");

    if (message.action === "getSelectedText") {
        // backgroundへ選択した文字を送信
        console.log("[search_shortcut]content_scripts backgroundへ選択した文字を送信");
        const selectedText = window.getSelection().toString();
        sendResponse({ text: selectedText });

    } else if (message.action === "openUrl") {
        console.log("[search_shortcut]content_scripts backgroundからのURLを開く");
        const searchUrl = message.text;
        window.open(searchUrl, "_blank"); // 新しいタブで開く
    }
});
