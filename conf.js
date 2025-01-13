body = JSON.stringify({})
// r = await fetch('https://confluence.jereh.cn/rpc/json-rpc/confluenceservice-v2/getGroups', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })


// 获取包含关键词的组list
r = await fetch('https://confluence.jereh.cn/rpc/json-rpc/confluenceservice-v2/getGroups', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
resp = await r.json()
gs = resp.filter(str => {
    return ["信息与数字化部", "安全组"].every(keyword => str.includes(keyword));
});


// 从组list获取员工list
us = []
for (g of gs) {
    //g="集团信息与数字化部安全组"
    url = `https://confluence.jereh.cn/rest/api/group/${g}/member`
    r = await fetch(url); resp = await r.json();
    for (u of resp.results) {
        if (/^\d{4,5}$/.test(u.username))
            us.push(u.username);
    }
    //break;
}
us = [...new Set(us)].sort((a, b) => Number(b) - Number(a));

// add us to group
url = 'https://confluence.jereh.cn/rpc/json-rpc/confluenceservice-v2/addUserToGroup'
groupname = 'vgIT'
for (username of us) {
    body = { username, groupname }
    body = JSON.stringify({ username, groupname })
    r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
    console.log(body);
    break;
}

removePermissionFromSpace(permission, remoteEntityName, spaceKey){
    permission = 'REMOVEOWNCONTENT'
    remoteEntityName = 'confluence-users'
    spaceKey = 'GNCRM'
    url = 'https://confluence.jereh.cn/rpc/json-rpc/confluenceservice-v2/removePermissionFromSpace'
    body = JSON.stringify([permission, remoteEntityName, spaceKey])
    r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
    resp = await r.text()
    console.log(body, resp);
}

getSpaceLevelPermissions(){
    url = 'https://confluence.jereh.cn/rpc/json-rpc/confluenceservice-v2/getSpaceLevelPermissions'
    r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
    resp = await r.json()
    console.log(resp);
}

// https://developer.atlassian.com/server/confluence/remote-confluence-methods/
addPermissionsToSpace(remoteEntityName, spaceKey){
    permissions = ['VIEWSPACE', 'REMOVEOWNCONTENT', 'COMMENT', 'EDITSPACE', 'SETSPACEPERMISSIONS', 'REMOVEPAGE', 'REMOVECOMMENT', 'REMOVEBLOG', 'CREATEATTACHMENT', 'REMOVEATTACHMENT', 'EDITBLOG', 'EXPORTSPACE', 'REMOVEMAIL', 'SETPAGEPERMISSIONS', 'VIEWSPACE']
    permissions = ['VIEWSPACE', 'REMOVEOWNCONTENT', 'EDITSPACE', 'COMMENT', 'CREATEATTACHMENT', 'SETPAGEPERMISSIONS']
    remoteEntityName = 'vgIT'
    spaceKey = 'GNCRM'
    url = 'https://confluence.jereh.cn/rpc/json-rpc/confluenceservice-v2/addPermissionsToSpace'
    body = JSON.stringify([permissions, remoteEntityName, spaceKey])
    r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
    resp = await r.text()
    console.log(body, resp);
}


async function getPages(spaceKey) {
    // spaceKey='JrPms'
    body = JSON.stringify([spaceKey])
    url = 'https://confluence.jereh.cn/rpc/json-rpc/confluenceservice-v2/getPages'
    r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
    resp = await r.text()
    // console.log(body,resp);
    return resp;
}
async function getSpace(spaceKey) {
    spaceKey = 'JrPms'
    body = JSON.stringify([spaceKey])
    url = 'https://confluence.jereh.cn/rpc/json-rpc/confluenceservice-v2/getSpace'
    r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
    resp = await r.json()
    console.log(body, resp);

    return resp;
}

async function getSpaces() {
    url = 'https://confluence.jereh.cn/rpc/json-rpc/confluenceservice-v2/getSpaces'
    r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
    resp = await r.json()
    return resp;
    console.log(resp);
}
async function getSpacePermissionSets(spaceKey) {
    // spaceKey='JrPms'
    body = JSON.stringify([spaceKey])
    url = 'https://confluence.jereh.cn/rpc/json-rpc/confluenceservice-v2/getSpacePermissionSets'
    r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
    resp = await r.json()
    // console.log(body,resp);

    return resp;
}

spaces = await getSpaces()
for (s of spaces) {
    spss = await getSpacePermissionSets(s.key);
    for (p of spss) { if (p.type == 'SETSPACEPERMISSIONS') { for (sp of p.spacePermissions) { if (sp.userName) { console.log(s.key, sp.userName) } } } }
}
for (s of spaces) {
    spss = await getSpacePermissionSets(s.key);
    for (p of spss) { if (true || p.type == 'SETSPACEPERMISSIONS') { for (sp of p.spacePermissions) { if (true || sp.userName) { console.log(s.key, p.type, sp.userName) } } } }
}

spaces = await getSpaces()
list=[]
for (s of spaces) {
    spss = await getSpacePermissionSets(s.key);
    for (p of spss) { if (true) { for (sp of p.spacePermissions) { if (sp.groupName&&sp.groupName.includes("数字化")) { list.push(s.key) } } } }
}
list=[... new Set(list)]


async function addPermissionsToSpace(remoteEntityName, spaceKey){
    // remoteEntityName = 'vgIT'
    // spaceKey = 'GNCRM'
    
    permissions = ['VIEWSPACE', 'REMOVEOWNCONTENT', 'COMMENT', 'EDITSPACE', 'SETSPACEPERMISSIONS', 'REMOVEPAGE', 'REMOVECOMMENT', 'REMOVEBLOG', 'CREATEATTACHMENT', 'REMOVEATTACHMENT', 'EDITBLOG', 'EXPORTSPACE', 'REMOVEMAIL', 'SETPAGEPERMISSIONS', 'VIEWSPACE']
    permissions = ['VIEWSPACE', 'REMOVEOWNCONTENT', 'EDITSPACE', 'COMMENT', 'CREATEATTACHMENT', 'SETPAGEPERMISSIONS']

    url = 'https://confluence.jereh.cn/rpc/json-rpc/confluenceservice-v2/addPermissionsToSpace'
    body = JSON.stringify([permissions, remoteEntityName, spaceKey])
    r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
    resp = await r.text()
    return resp
    console.log(body, resp);
}
for(sk of list){
    console.log(sk);await addPermissionsToSpace('vgIT',sk)
    break;
}
