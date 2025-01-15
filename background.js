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

// DeepL検索URL作成
function createDeepLSearchUrl(searchQuery) {
    const baseUrl = "https://www.deepl.com/ja/translator#en/ja/";
    // クエリをエンコードしてURLに直接埋め込む
    const encodedQuery = encodeURIComponent(searchQuery);
    return `${baseUrl}${encodedQuery}`;
}

// ショートカットが押された時の処理
chrome.commands.onCommand.addListener((command) => {
    // 現在アクティブなタブを取得
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        var searchUrl = null; // 選択された文字変数の初期化
        const activeTab = tabs[0]; // アクティブのタブを取得

        // content_scripts に選択されたテキストを取得するメッセージを送信
        chrome.tabs.sendMessage(
            activeTab.id,
            { action: "getSelectedText" },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("content_scripts からのメッセージ受信失敗:", chrome.runtime.lastError.message);
                } else if (response) {
                    console.log("content_scripts からのメッセージ:", response.text);
                    // 検索対象があれば検索
                    if (response.text !== '' && response.text !== null) {
                        // コマンドから検索するサイトを指定
                        switch (command) {
                            case "Google_search_command":
                                searchUrl = createGoogleSearchUrl(response.text);
                                break;
                            case "Deepl_search_command":
                                searchUrl = createDeepLSearchUrl(response.text);
                                break;
                            default:
                                console.log("検索なし");
                        }
                        console.log("検索URL " + searchUrl);
                        // content_scripts に作成したURLを送信
                        chrome.tabs.sendMessage(activeTab.id, { action: "openUrl", text: searchUrl });
                    }
                }
            }
        );
    });
});
