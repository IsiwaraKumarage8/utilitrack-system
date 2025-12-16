- The Admin Dashboard Page; 
    - "Recent Activity" Section: Button; "View All Transations"; Its not doing anything. Its just there.
    - "Quick Actions" Section: "Add New Customer", "Generate Bill", "Record Payment", "View Reports" buttons not doing anything. 

- Remove the "Search" and "Bell Button" (notifications button) from the top-most bar.

- The "customer Management" page;
    - the search bar is not working. 
    - When a customer has a company name associated with them, the company name appears under the customer name in the row, and causes the name to move around compared to the other rows with customers that do not have company names. As a fix, In the table, add another column to display the company name. Just say something like "no company associated" or anything suitable for rows with customers that do not have company names. 
    - Also, when the customer names are big, one word of the name goes to the bottom like in the row. Make sure despite the length of the name, the name is in one line, even if this increases the width of the customer column. Also, add horizontal scrolling functionality so that even if the width of the table is too great, we can still scroll horizontally to see the unseen columns of the table. But make the actions column sticky. Also, the pagination bar has to be sticky too, make sure its not scrollable when adding the scroll bar to the table. (You can check the "Service Connections" table to see how it's horizontal scrolling is working, because its working how i want it to).

- Service Connections pages;
    - Search bar is not functional.
    - In the table, for in the utility colum, for the icons,also the picture changes, the colour is still the same, making it indistinguishable at a glance.
        - ALso, when you press the eye icon, the modal that opens to show the service connection's details, The "Recent Meter Readings" and "Billing History" and "Current Status" sections are using placeholder data instead of using APIs to get real data for that specific service connection.  
        - Also, add some space between the sections, they are all close together and touching each other.
        - Also, the consumption column; its values are displayed in white, this is a problem because the table background is also white; adjust the font colour AND the font size to match the rest of the data. Make sure data displayed in this column is not placeholder data and is rather gettting real data through APIs.
        - The status colum; its just showing a blue components, not the actual status. When you fix this, make sure each status has a distinguished colour, check the other pages for the colours used there.

- "Meter Management" page;
    - "Register Meter" button leads to a blank page instead of a form modal to register a meter.
    - The table:
        - The data in each cell is compressed, as in they are in multiple lines just to make the entire table visible. its fine if the entire table is not visible, just add a horizontal scrolling functionality (You can check the "Service Connections" table to see how it's horizontal scrolling is working, because its working how i want it to). Have the tables width adjust so that no data in any cell exists in multiple lines, and rather exists in a single line. 
        - The status colum; its just showing a blue components, not the actual status. When you fix this, make sure each status has a distinguished colour, check the other pages for the colours used there.
        - When you press the "eye" icon, it leads to a empty white space instead of a modal thaat shows maybe details fo the currnet meter row. 
        - All the action buttons are faulty, double check these. 

- "Meter Readings" page:
    - Search bar is not functional.
    - The data in each cell is compressed, as in they are in multiple lines just to make the entire table visible. its fine if the entire table is not visible, just add a horizontal scrolling functionality (You can check the "Service Connections" table to see how it's horizontal scrolling is working, because its working how i want it to). Have the tables width adjust so that no data in any cell exists in multiple lines, and rather exists in a single line. 
    - When you press the eye icon to check the "meter reading" details, the modal style is bad, its all white. Check the "Details" modals of other tables to understand the styling and apply here.
    - In this Details modal:
        - "Reading Information": The Data for the "Reading Type" is faulty, just one blue hollow line.
        - "Reading History" - Uses palceholder data.
        - "Reading Comparison" - uses placeholder data instead of actually getting real data and comparing them. 
        - "Consumption Breakdow" - Uses placeholder data.
        - "Associated Bills" - Not sure whether it has an API to get real data. 
        - "Edit Reading" button does not work.
        - "Generate Bill" button no longer works.
    - The actual action icons of the actions column of the table, except for the eye icon, the other two icons do nothing and is not functional.

- "Billing" Page:
    - Actions column icons no functionality.
    - Search bar faulty, every time you type a word, page reloads and you have to re click the search bar to continue typing.

- "Payments" Page:
    - The data in each cell is compressed, as in they are in multiple lines just to make the entire table visible. its fine if the entire table is not visible, just add a horizontal scrolling functionality (You can check the "Service Connections" table to see how it's horizontal scrolling is working, because its working how i want it to). Have the tables width adjust so that no data in any cell exists in multiple lines, and rather exists in a single line. 
    - The actual action icons of the actions column of the table, except for the eye icon, the other two icons do nothing and is not functional.
    - The method column, it shows an icon of the payment methodd and another blue hollow shape next to it. 
    - The Status colum also does not show the proper status, just a blue shape.
    - "Record Payment" button does not work. 