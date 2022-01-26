import React, {useState, useEffect, useMemo} from 'react';
import BTable from 'react-bootstrap/Table';

export const useTableRender = () => {

    const renderAdminTable = (table, headers, userAction, redirect, userData) => {

        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            rows,
            prepareRow,
            } = table;

        return (
            <BTable striped bordered hover size="sm" {...getTableProps()}>
                <thead>
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>
                          {column.render('Header')}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell, index) => {
                          console.log();
                        
                          if (index === headers.length - 1) {
                            return (
                                <td {...cell.getCellProps()}>
                                    {cell.render('Cell')}
                                    <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                                      <button type="button" class="btn btn-danger" onClick={e=>userAction(row.original.id, 'delete')}>{userData.language==='en'?'delete':'удалить'}</button>
                                      <button type="button" class="btn btn-warning" onClick={e=>{userAction(row.values.id, 'block')}}>{userData.language==='en'?row.original.blocked?'unblock':'block':row.original.blocked?'разблокировать':'заблокировать'}</button>
                                      <button type="button" class="btn btn-success" 
                                      onClick={e=>userAction(row.values.id, 'promote')}>{userData.language==='en'?row.original.admin?'demote to regular user':'promote to admin':row.original.admin?'сделать обычным пользователем':'сделать администратором'}</button>
                                      <button type="button" class="btn btn-primary" onClick={e=>redirect(row.original.id)}>{userData.language==='en'?'open':'открыть'}</button>
                                    </div>
                                </td>
                            )
                          }

                          return (
                            <td {...cell.getCellProps()}>
                              {cell.render('Cell')}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
            </BTable>
        )
    }
    return {renderAdminTable}
}