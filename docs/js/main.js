window.addEventListener('DOMContentLoaded', async(event) => {
    try {
        window.mpurse.updateEmitter.removeAllListeners()
          .on('stateChanged', isUnlocked => console.log(isUnlocked))
          .on('addressChanged', address => console.log(address));
    } catch(e) { console.debug(e) }
    document.querySelector(`toot-dialog`).addEventListener('toot', async(event) => {
        console.debug('トゥートしました！ここから先はWebComponent,brid.gyと連携させたいが難しそう。brid.gyのAPIがなさそうなのとタイミング問題もある。なので妥協してマストドンAPIの応答からコメントHTMLを作成して即座に表示する。', event.detail);
        const html = new Comment().mastodonResToComment(event.detail.json)
        const comment = document.querySelector(`mention-section`).shadowRoot.querySelector(`#web-mention-comment`)
        comment.innerHTML = html + comment.innerHTML
    });
});

