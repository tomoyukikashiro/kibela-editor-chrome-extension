const path = location.pathname

// 編集ページ用
if (isEditPage(path)) {
  const hash = location.hash.replace('#', '').trim()
  if (hash) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        // 編集エリア内の要素はスクロールに応じてelementを都度追加、削除しているので、markdown下部の要素は初期表示時には存在しない。
        // よて、プレビューエリアの該当要素のスクロール距離と同じ比率を編集エリアでスクロールさせることで、
        // だいたい同じ要素が見えるようになる
        const header = document.getElementById(hash)
        const scrollRate = header.parentElement.offsetTop / document.body.querySelector('.editor-previewContainer').scrollHeight
        const editor = document.body.querySelector('.CodeMirror-scroll')
        editor.scrollTo({top: editor.scrollHeight * scrollRate})
      }, 800)
    })
  }
}

// 表示ページ用
console.log(11111)
if ((isWikiPage(path) || isBlogPage(path)) && !isEditPage(path)) {
  if (hasEditPermission(document.body)) {
    insertEditButton(getAnchors(document.body))
  }
}

function getAnchors(body) {
  return Array.from(body.querySelectorAll('.anchor'))
}

function insertEditButton(anchorLinks) {
  anchorLinks.forEach(link => {
    const editLink = createEditLink(link.id)
    link.parentNode.insertBefore(editLink, link)
  })
}

function createEditLink(anchor) {
  const icon = document.createElement('i')
  const link = document.createElement('a')
  icon.setAttribute('class', 'fa fa-edit kex-edit-icon')
  link.setAttribute('href', generateEditPagePath(document.body, anchor))
  link.appendChild(icon)
  return link
}

function getEditPath(body) {
  return body.querySelector('.entry-action').getAttribute('href')
}

function hasEditPermission(body) {
  return !!getEditPath(body)
}

function generateEditPagePath(body, anchor) {
  const editPath = getEditPath(body)
  return `${editPath}#${anchor}`
}

function isWikiPage(path) {
  return path.startsWith('/notes/')
}

function isBlogPage(path) {
  return path.startsWith('/@')
}

function isEditPage(path) {
  return new RegExp('/notes/\\d+/edit').test(path)
}

