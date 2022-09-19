import React from 'react'

const Header = () => {
  return <div className="d-flex align-items-center p-2 text-dark">
    <img src="favicon.ico" className="mb-0 lh-100" height="50px" alt="" />
    <div className="lh-100 mx-2">
      <h2>GSN (v3 beta) Relay Servers</h2>
      <b>Note</b> This is the status page of the new v3 (beta). For the current v2 network see <a
        href="https://relays-v2.opengsn.org">here</a>
    </div>
    <hr />
  </div>
}

export default React.memo(Header)