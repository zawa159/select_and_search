// Google検索URL作成
function createGoogleSearchUrl(searchQuery) {
    const baseUrl = "https://www.google.com/search";
    const params = new URLSearchParams({
        q: searchQuery, // 検索クエリ
        hl: "ja",       // 言語設定（日本語）
        ie: "UTF-8"     // 文字エンコーディング
    });
    return `${baseUrl}?${params.toString()}`;
}

// ショートカットが押された時の処理
chrome.commands.onCommand.addListener((command) => {
    // コマンド確認
    if (command === "search_command") {
        // 現在アクティブなタブを取得
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];

            // content_scripts に選択されたテキストを取得するメッセージを送信
            chrome.tabs.sendMessage(
                activeTab.id,
                { action: "getSelectedText" },
                (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("[search_shortcut]content_scripts からのメッセージ受信失敗:", chrome.runtime.lastError.message);
                    } else if (response) {
                        console.log("[search_shortcut]content_scripts からのメッセージ:", response.text);
                        // 検索対象があれば検索
                        if (response.text !== '' || response.text !== null) {
                            const searchUrl = createGoogleSearchUrl(response.text);
                            console.log("検索URL " + searchUrl);
                            // content_scripts に作成したURLを送信
                            chrome.tabs.sendMessage(activeTab.id, { action: "openUrl", text: searchUrl });
                        }
                    }
                }
            );
        });
    }
});
