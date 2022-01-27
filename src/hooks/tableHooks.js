import React, {useState, useEffect, useMemo} from 'react';
import BTable from 'react-bootstrap/Table';
import {useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce} from 'react-table';
import MDEditor from '@uiw/react-md-editor';

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
                                      <button type="button" class="btn btn-primary" onClick={e=>console.log(row.original.id)}>{userData.language==='en'?'open':'открыть'}</button>
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



    const renderCollectionTable = (table, headers, selectHandler, redirect, userData, collectionData) => {



      function GlobalFilter({
          preGlobalFilteredRows,
          globalFilter,
          setGlobalFilter,
        }) {
        const count = preGlobalFilteredRows.length
        const [value, setValue] = React.useState(globalFilter)
        const onChange = useAsyncDebounce(value => {
          setGlobalFilter(value || undefined)
        }, 200)
      
        return (
          <span>
            Search:{' '}
            <input className='table-filter'
              value={value || ""}
              onChange={e => {
                setValue(e.target.value);
                onChange(e.target.value);
              }}
              placeholder={`${count} records...` }
              style={{
                fontSize: '1.1rem',
                border: '0',
              }}
            />
          </span>
        )
      }

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
                  {headerGroup.headers.map(column => {
                    return (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      {column.isSorted ? (column.isSortedDesc ? " ▲" : " ▼") : ""}
                    </th>)
                  })}
                </tr>
              ))}
              <tr>
                <th
                  colSpan={table.visibleColumns.length}
                  style={{
                    textAlign: 'left',
                  }}
                >
                  <GlobalFilter
                    preGlobalFilteredRows={table.preGlobalFilteredRows}
                    globalFilter={table.state.globalFilter}
                    setGlobalFilter={table.setGlobalFilter}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell, index) => {
                      console.log();
                      if (index === 0 && (userData.userId === collectionData.creator || userData.admin)) {
                        return (
                          <td {...cell.getCellProps()}>
                          {cell.render('Cell')}
                          <input type='checkbox' className='checkbox-cell' data-id={cell.row.original._id} onChange={selectHandler} />
                        </td>
                        )
                      } 
                      if (index === headers.length - 1) {
                        return (
                          <td {...cell.getCellProps()}>
                          {cell.render('Cell')}
                          <button type="button" className="btn btn-primary" data-id={row.values._id} onClick={(e)=>{redirect(e)}}>
                          {userData.language==='en'?'Open':'Открыть'}</button>
                        </td>
                        )
                      }
                      if (cell.column.fieldType && cell.column.fieldType.includes('text')) {
                        return (
                          <td {...cell.getCellProps()}>
                          <MDEditor.Markdown 
                            source={cell.value} 
                          />
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

    return {renderAdminTable, renderCollectionTable}
}